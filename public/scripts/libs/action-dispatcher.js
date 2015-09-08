
/*
promise based action dispatcher center,
use it like basic client side jssdk for apis
 */
var exports, factory;

factory = function($, _) {
  var $reject, $when, ActionDispatcher, Deferred;
  Deferred = $.Deferred || $.defer;
  $when = $.when;
  $reject = function() {
    var dfd;
    dfd = new Deferred();
    dfd.reject.apply(dfd, arguments);
    return dfd.promise;
  };
  return ActionDispatcher = (function() {
    ActionDispatcher.createAPI = function(Model, methods) {
      var actions, api, method, name;
      actions = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = methods.length; i < len; i++) {
          name = methods[i];
          method = Model[name].bind(Model);
          results.push([name, method]);
        }
        return results;
      })();
      return api = new this({
        actions: _.object(actions)
      });
    };

    function ActionDispatcher(options) {
      if (options == null) {
        options = {};
      }
      this.addActions(options.actions || {});
      return this;
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
      var dfd, msg;
      if (this.actions[method]) {
        dfd = $when(this.actions[method].bind(this)(data));
        if (this.isShowingRequestDebug) {
          this.dfdDebug(dfd, method, data);
        }
        if (_.isFunction(callback) && dfd.then) {
          dfd.then(callback);
        }
        return dfd.then(function(data) {
          if (data.error != null) {
            return (new Deferred).reject(data);
          }
          return data;
        });
      } else {
        msg = "Dispatcher Err: Action '" + method + "' not exists";
        console.log("reject msg", msg);
        return $reject(msg);
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
