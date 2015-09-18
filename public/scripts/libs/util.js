var slice = [].slice;

define([], function() {
  var util;
  require.loadExport = function(arr, ctx) {
    if (ctx == null) {
      ctx = window;
    }
    if (_.isString(arr)) {
      arr = [arr];
    }
    return require(arr, function() {
      var i, idx, j, len, results;
      results = [];
      for (idx = j = 0, len = arr.length; j < len; idx = ++j) {
        i = arr[idx];
        i = i.replace(/\//g, "_");
        results.push(ctx[i] = arguments[idx]);
      }
      return results;
    });
  };
  util = {
    promiseFCall: function() {
      var args, dfd, method;
      method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      dfd = $.Deferred();
      method.apply(null, slice.call(args).concat([function() {
        return dfd.resolve.apply(dfd, arguments);
      }]));
      return dfd;
    },
    deparamQuery: function(string) {
      var pairs;
      if (string == null) {
        string = location.search.slice(1);
      }
      if (string.length === 0) {
        return {};
      }
      pairs = _.map(string.replace(/\+/g, ' ').split('&'), function(pair) {
        var kv;
        kv = pair.split("=");
        return [kv[0], decodeURIComponent(kv[1])];
      });
      return _.object(pairs);
    },
    parseUrl: function(url) {
      var el, ret;
      el = $("<a>", {
        href: url
      })[0];
      ret = _.pick(el, ["host", "origin", "pathname", "search", "hash"]);
      if (ret.search) {
        ret.query = this.deparamQuery(ret.search.slice(1));
      } else {
        ret.query = {};
      }
      ret.getUrl = function() {
        return ret.origin + ret.pathname + "?" + $.param(ret.query);
      };
      return ret;
    }
  };
  return util;
});
