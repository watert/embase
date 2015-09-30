
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
    var Doc, parseRequest, parseReturn, router;
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
      "parseReturnArray": function(data) {
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
        data.lastModify = data.createAt = new Date;
        return (new Doc(data)).save();
      },
      "PUT": function(id, data) {
        data.lastModify = new Date;
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
    parseRequest = function(req) {
      var data, params;
      data = apis.getRequesetData(req);
      params = options.parseData.bind({
        req: req
      })(data);
      return {
        params: params,
        id: req.params.id,
        method: req.method
      };
    };
    parseReturn = function(data, ctx) {
      var _parse;
      _parse = options.parseReturn.bind(ctx);
      if (_.isArray(data)) {
        data = _.toArray(_.map(data, _parse));
        return data = options.parseReturnArray.bind(ctx)(data);
      } else {
        return data = _parse(data);
      }
    };
    router.get("/count", function(req, res) {
      var params;
      params = parseRequest(req).params;
      return Doc.find(params).then(function(data) {
        return {
          result: {
            count: data.length
          },
          id: -1
        };
      }).then(res.ret).fail(res.retError);
    });
    router.all("/:id?", function(req, res, next) {
      var ctx, id, method, params, ref;
      ref = parseRequest(req), method = ref.method, id = ref.id, params = ref.params;
      ctx = {
        req: req,
        res: res,
        method: method,
        id: id,
        params: params
      };
      if (params.error) {
        return res.retError(params);
      }
      return options[method].bind(ctx)(id, params).then(function(data) {
        if (data._data) {
          data = data._data;
        }
        return res.ret(parseReturn(data, ctx));
      }).fail(function(err) {
        var data;
        console.trace(err);
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
