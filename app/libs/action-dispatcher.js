var exports, factory;

factory = function($, _) {
  var $when, ActionDispatcher, Deferred;
  Deferred = $.Deferred || $.defer;
  $when = $.when;
  return ActionDispatcher = (function() {
    function ActionDispatcher() {
      this;
    }

    ActionDispatcher.prototype.dfdDebug = function(dfd, method, req) {
      var alertWithStatus;
      alertWithStatus = function(status, res) {
        var info;
        info = "[" + status + "] " + method + ":\nreq: " + (JSON.stringify(req)) + ";\nres: " + (JSON.stringify(res)) + ";";
        return alert(info);
      };
      dfd.then(function(res) {
        return alertWithStatus("success", res);
      });
      return dfd.fail(function(res) {
        return alertWithStatus("fail", res);
      });
    };

    ActionDispatcher.prototype.call = function(method, data, callback) {
      var dfd;
      if (this.actions[method]) {
        dfd = $when(this.actions[method].bind(this)(data));
        if (this.isShowingRequestDebug) {
          this.dfdDebug(dfd, method, data);
        }
        if (_.isFunction(callback) && dfd.then) {
          dfd.then(callback);
        }
        return dfd.then(function(data) {
          if (data.base_rsp && data.base_rsp.ret < 0) {
            return (new Deferred).reject(data);
          }
          return data;
        });
      } else {
        throw "Dispatcher Err: Action '" + method + "' not exists";
      }
    };

    ActionDispatcher.prototype.requireActions = function(paths, callback) {
      if (_.isString(paths)) {
        paths = [paths];
      }
      return require(paths, function() {
        _.each(arguments, function(ActionsHandler) {
          return ActionsHandler.initialize();
        });
        return typeof callback === "function" ? callback() : void 0;
      });
    };

    ActionDispatcher.prototype.actions = {};

    ActionDispatcher.prototype.fakeRequest = function(path, data) {
      var dfd;
      dfd = new Deferred();
      require(["models/_fake-data"], function(data) {
        if (data[path]) {
          return dfd.resolve(data[path]);
        } else {
          return dfd.reject({
            ret: -1,
            msg: "no fake data: " + path
          });
        }
      });
      return dfd;
    };

    ActionDispatcher.prototype.addActions = function(map) {
      return _(map).each((function(_this) {
        return function(actionMethod, name) {
          var oldMethod;
          oldMethod = _this.actions[name];
          if (!oldMethod) {
            return _this.actions[name] = actionMethod.bind(_this);
          } else {
            throw "Action exists: " + name;
          }
        };
      })(this));
    };

    return ActionDispatcher;

  })();
};

if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
  define(["jquery", "underscore"], factory);
}

if (exports && (typeof module !== "undefined" && module !== null ? module.exports : void 0)) {
  exports = module.exports = factory(require("q"), require("underscore"));
}
