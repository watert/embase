var _, express, getRequesetData, restful;

_ = require("underscore");

express = require("express");

getRequesetData = require("./util").getRequesetData;

restful = function(options) {
  var Doc, router;
  if (options == null) {
    options = {};
  }
  router = express.Router();
  Doc = options.model;
  _.defaults(options, {
    "next": function(req, res, next) {
      return next();
    },
    "parseData": function(data) {
      return data;
    },
    "GET": function(id, data) {
      if (!id) {
        return Doc.find(data);
      } else {
        return Doc.findOne({
          _id: id
        });
      }
    },
    "POST": function(id, data) {
      return (new Doc(data)).save();
    },
    "PUT": function(id, data) {
      return Doc.findOne({
        _id: id
      }).then(function(doc) {
        return doc.save(data);
      });
    },
    "DELETE": function(id) {
      return Doc.findOne({
        _id: id
      }).then(function(doc) {
        return doc.remove().then(function(num) {
          return {
            _id: id,
            deleted: true
          };
        });
      });
    }
  });
  router.all("/:id?", function(req, res, next) {
    var ctx, data, id, method;
    method = req.method;
    id = req.params.id;
    data = getRequesetData(req);
    ctx = {
      req: req,
      res: res,
      method: method,
      id: id,
      data: data
    };
    data = options.parseData.bind(ctx)(data);
    return options[method].bind(ctx)(id, data).then(function(data) {
      res.restData = data;
      return options.next.bind(ctx)(req, res, next);
    });
  });
  return router;
};

module.exports = restful;
