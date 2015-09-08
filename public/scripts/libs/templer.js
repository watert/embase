
/*

 * sample with

 * sample with sub templer
tmpl = templer
    outsider: " world "
    useInIndex: templer "hello <%=outsider%> "
    index:" <%=useInIndex()%> "
console.assert tmpl() == "hello world"

 * sample with this._super
tmpl = templer({index: "hello world"}).extend
    index: -> "before #{@_super.index} after"
console.assert tmpl() == "before hello world after"
 */
var exports, factory,
  slice = [].slice;

factory = function(_) {
  var templer;
  return templer = function(options) {
    var ctx, tmpl, tmplMethod;
    if (!options) {
      throw "Empty tmpl";
    }
    if (_.isString(options)) {
      options = {
        index: options
      };
    }
    if (_.isString(tmpl = options.index)) {
      tmpl = _.template(options.index);
    }
    ctx = _.extend({}, tmpl, options);
    tmplMethod = function() {
      var args, data;
      data = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      data = _.extend({}, ctx, data);
      _.each(ctx, function(_tmpl, key) {
        if (_tmpl.type === "templer") {
          data[key] = _tmpl;
          _.defaults(_tmpl._context, ctx);
          return _.defaults(_tmpl._context, data);
        }
      });
      return tmpl.bind(ctx).apply(null, [data].concat(slice.call(args)));
    };
    _.extend(tmplMethod, ctx, {
      type: "templer",
      _context: ctx,
      extend: function(options) {
        var opt2;
        opt2 = _.extend({}, ctx, options);
        opt2._super = ctx;
        return templer(opt2);
      }
    });
    return tmplMethod;
  };
};

if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
  define(["underscore"], factory);
} else if (exports && (typeof module !== "undefined" && module !== null ? module.exports : void 0)) {
  exports = module.exports = factory(require("underscore"));
} else {
  _.templer = factory(_);
}
