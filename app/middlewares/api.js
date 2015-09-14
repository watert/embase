var Dispatcher, _, apis, express;

_ = require("underscore");

express = require("express");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

apis = {
  retJSON: function(options) {
    return function(req, res, next) {
      res.ret = function(data) {
        var id, result;
        result = data._data || data;
        id = data.id || data._id || _.map(data, function(item) {
          return item.id || item._id;
        });
        result = _.omit(result, "password");
        res.json({
          result: result,
          id: id
        });
        return res;
      };
      res.retError = function(code, msg, result) {
        var error;
        if (result == null) {
          result = null;
        }
        if (msg.error) {
          error = msg.error, result = msg.result;
        } else {
          error = {
            code: code,
            message: msg
          };
        }
        res.status(code).json({
          result: result,
          error: error
        });
        return res;
      };
      return next();
    };
  },
  getRequesetData: function(req) {
    var method;
    method = req.method;
    if (method === "GET") {
      return req.query;
    } else {
      return req.body;
    }
  },
  jsonrpc: function(options) {
    var Model, api, router;
    if (options == null) {
      options = {};
    }
    Model = options.model;
    router = express.Router();
    api = Dispatcher.createAPI(Model, options.methods);
    router.use(apis.retJSON());
    router.post("/:method?", function(req, res) {
      var data, method;
      method = req.params.method;
      data = apis.getRequesetData(req) || {};
      return api.call(method, data).then(function(data) {
        return res.ret(data);
      }).fail(function(err) {
        return res.status(400).retError(err);
      });
    });
    return router;
  },
  restful: function(options) {
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
    router.use(apis.retJSON());
    router.all("/:id?", function(req, res, next) {
      var ctx, data, id, method;
      method = req.method;
      id = req.params.id;
      data = apis.getRequesetData(req);
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
  }
};

module.exports = apis;
