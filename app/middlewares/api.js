
/*
apis = require("middleware/api")
router.use "/api/restful/", restful(model:User)
router.use "/api/", jsonrpc(model:User)
 */
var Dispatcher, _, apis, express, getRequesetData, q, retJSON;

_ = require("underscore");

express = require("express");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

q = require("q");

q.longStackSupport = true;

retJSON = function(options) {
  return function(req, res, next) {
    res.ret = function(data) {
      var defaultAttr, id, result;
      result = data;
      defaultAttr = function(data, arr) {
        var i, key, len, ret;
        for (i = 0, len = arr.length; i < len; i++) {
          key = arr[i];
          if (!_.isUndefined(ret = data[key])) {
            console.log("not isUndefined", ret);
            return ret;
          }
        }
        return data;
      };
      result = defaultAttr(data, ["_data", "result"]);
      id = data.id || data._id || null;
      if (_.isArray(data)) {
        id = _.map(data, function(item) {
          return item.id || item._id;
        });
      }
      res.json({
        result: result,
        id: id
      });
      return res;
    };
    res.retError = function(code, msg, result) {
      var json;
      if (result == null) {
        result = null;
      }
      json = {};
      if (code instanceof Error) {
        console.trace(code);
      }
      if (msg != null ? msg.error : void 0) {
        json = {
          error: error,
          result: result
        };
      } else if (code.error) {
        json = code;
      } else {
        json = {
          error: {
            code: code,
            message: msg
          }
        };
      }
      res.status(json.error.code || 500).json(json);
      return res;
    };
    return next();
  };
};

getRequesetData = function(req) {
  var method;
  method = req.method;
  if (method === "GET") {
    return req.query;
  } else {
    return req.body;
  }
};

apis = {
  retJSON: retJSON,
  getRequesetData: getRequesetData,
  jsonrpc: function(options) {
    var Model, router;
    if (options == null) {
      options = {};
    }
    options = _.extend({
      events: {},
      parseData: function(data) {
        return data;
      }
    }, options);
    Model = options.model;
    router = express.Router();
    router.use("/*", apis.retJSON());
    router.post("/:method?", function(req, res, next) {
      var data, method;
      method = req.params.method;
      data = apis.getRequesetData(req) || {};
      data = options.parseData.bind({
        Model: Model,
        data: data,
        method: method
      })(data);
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
      "parseData": function(data) {
        return data;
      },
      "parseReturn": function(data) {
        return data;
      },
      "GET": function(id, data) {
        if (!id) {
          return Doc.find(data).then(function(_data) {
            _data.result = _.toArray(_data);
            return _data;
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
    router.get("/count", function(req, res) {
      var ctx, data;
      data = apis.getRequesetData(req);
      ctx = {
        req: req,
        res: res,
        data: data
      };
      data = options.parseData.bind(ctx)(data);
      return Doc.find(data).then(function(data) {
        return {
          result: {
            count: data.length
          },
          id: -1
        };
      }).then(res.ret).fail(res.retError);
    });
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
        if (data._data) {
          data = data._data;
        }
        if (_.isArray(data)) {
          data = _.map(data, function(item) {
            return options.parseReturn.bind(ctx)(item);
          });
        } else {
          data = options.parseReturn.bind(ctx)(data);
        }
        console.log("rest action", method, id, data, options.parseReturn);
        return res.ret(data);
      }).fail(function(err) {
        console.log("restful error", method, Doc.name, arguments);
        console.trace(err);
        data = err;
        if (!err.error) {
          data = {
            error: {
              code: 500,
              message: err.toString()
            }
          };
        }
        return res.retError(data);
      });
    });
    return router;
  }
};

module.exports = apis;
