var Dispatcher, _, apis, express, q;

_ = require("underscore");

express = require("express");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

q = require("q");

apis = {
  retJSON: function(options) {
    return function(req, res, next) {
      res.ret = function(data) {
        var id, result;
        result = data._data || data.result || data;
        id = data.id || data._id || _.map(data, function(item) {
          return item.id || item._id;
        });
        if (!_.isArray(result)) {
          result = _.omit(result, "password");
        }
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
        if (msg != null ? msg.error : void 0) {
          error = msg.error, result = msg.result;
        } else if (code.error) {
          error = code.error;
        } else {
          error = {
            code: code,
            message: msg
          };
        }
        res.status(error.code).json({
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
    var Model, router;
    if (options == null) {
      options = {};
    }
    options = _.extend({
      on: {}
    }, options);
    Model = options.model;
    router = express.Router();
    router.use("/*", apis.retJSON());
    router.post("/:method?", function(req, res, next) {
      var data, method;
      method = req.params.method;
      data = apis.getRequesetData(req) || {};
      return q.when(Model[method](data)).then(function(_data) {
        var ctx, eventMethod;
        res.data = _data;
        ctx = {
          data: _data,
          req: req,
          res: res,
          method: method
        };
        if (eventMethod = options.events[method]) {
          eventMethod.bind(ctx)(req, res);
        }
        return res.ret(_data);
      }).fail(function(err) {
        return res.retError(err);
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
          return Doc.find(data).then(function(data) {
            data.result = _.toArray(data);
            return data;
          });
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
          console.log("restful put", Doc, data);
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
      if (data.error) {
        return res.retError(data);
      }
      return options[method].bind(ctx)(id, data).then(function(data) {
        return res.ret(data);
      })["catch"](function(err) {
        return res.retError(err);
      });
    });
    return router;
  }
};

module.exports = apis;
