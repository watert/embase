var exports, factory,
  slice = [].slice;

factory = function(_) {
  var templer;
  templer = function(options) {
    var ctx, tmpl, tmplMethod;
    if (!options) {
      throw "Empty tmpl";
    }
    if (_.isString(options)) {
      options = {
        index: options
      };
    }
    tmpl = _.template(options.index);
    ctx = _.extend({}, tmpl, options);
    tmplMethod = function() {
      var args, data;
      data = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      data = _.extend({}, ctx, data);
      return tmpl.bind(ctx).apply(null, [data].concat(slice.call(args)));
    };
    _.extend(ctx, {
      require: function() {
        var args, mod, name;
        name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        mod = templer.require(name);
        return typeof mod === "function" ? mod.apply(null, args) : void 0;
      }
    });
    _.extend(tmplMethod, {
      context: ctx,
      get: function(key) {
        return ctx[key];
      },
      extend: function(options) {
        var opt2;
        opt2 = _.extend({}, ctx, options);
        return templer(opt2);
      }
    });
    return tmplMethod;
  };
  return _.extend(templer, {
    modules: {},
    require: function(name) {
      var mod;
      mod = this.modules[name];
      if (!mod) {
        throw "mod " + name + " not defined";
      }
      return mod;
    },
    define: function(name, tmpl) {
      if (!_.isFunction(tmpl)) {
        tmpl = templer(tmpl);
      }
      return this.modules[name] = tmpl;
    }
  });
};

if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
  define(["underscore"], factory);
}

if (exports && (typeof module !== "undefined" && module !== null ? module.exports : void 0)) {
  exports = module.exports = factory(require("underscore"));
}
