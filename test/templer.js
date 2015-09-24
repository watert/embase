var DBStore, Templer, User, UserDoc, _, assert, ref, templer,
  slice = [].slice;

ref = require("./base"), DBStore = ref.DBStore, assert = ref.assert, _ = ref._, User = ref.User, UserDoc = ref.UserDoc;

Templer = (function() {
  function Templer(tmpls) {
    if (_.isString(tmpls)) {
      tmpls = {
        index: tmpls
      };
    }
    this.tmpls = tmpls;
    return this.makeMethod();
  }

  Templer.prototype.makeInvoke = function(tmpls) {
    var invoke;
    return invoke = function() {
      var args, data, method;
      method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (_.isString(method)) {
        method = _.template(method);
      }
      data = _.extend.apply(_, [{}, tmpls].concat(slice.call(args)));
      return method(data);
    };
  };

  Templer.prototype.makeMethod = function() {
    var mainTmpl, tmplMethod, tmpls;
    tmpls = _.extend({
      invoke: this.makeInvoke(tmpls)
    }, this.tmpls);
    if (_.isString(tmpls.index)) {
      mainTmpl = _.template(tmpls.index);
    }
    tmplMethod = (function(_this) {
      return function() {
        var args, data;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        data = _.extend.apply(_, [{
          args: args || []
        }, tmpls].concat(slice.call(args)));
        return mainTmpl(data);
      };
    })(this);
    return _.extend(tmplMethod, tmpls, {
      extend: (function(_this) {
        return function(newTmpls) {
          return _this.extend(tmplMethod, newTmpls);
        };
      })(this)
    });
  };

  Templer.prototype.extend = function(tmplMethod, newTmpls) {
    newTmpls = _.extend({}, this.tmpls, newTmpls);
    _.each(newTmpls, (function(_this) {
      return function(tmpl, k) {
        var newTmpl, superTmpl;
        newTmpl = newTmpls[k];
        if (superTmpl = _this.tmpls[k]) {
          return newTmpl._super = function() {
            var args, ref1;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return (ref1 = _this.tmpls).invoke.apply(ref1, [superTmpl].concat(slice.call(args)));
          };
        }
      };
    })(this));
    newTmpls._parent = this.tmpls;
    return new Templer(newTmpls);
  };

  return Templer;

})();

templer = function(tmpls) {
  return (function(func, args, ctor) {
    ctor.prototype = func.prototype;
    var child = new ctor, result = func.apply(child, args);
    return Object(result) === result ? result : child;
  })(Templer, arguments, function(){});
};

templer.extend = function(tmpls) {
  return templer(tmpls);
};

describe("Templer", function() {
  it("should work", function() {
    var newTmpl, tmpl;
    tmpl = templer({
      index: "hello <%=world%>",
      world: "world"
    });
    assert.equal(tmpl(), "hello world");
    newTmpl = tmpl.extend({
      world: tmpl.world + "2"
    });
    return assert.equal(newTmpl(), "hello world2");
  });
  it("should context deliver to sub templer", function() {
    var tmpl;
    tmpl = templer({
      outsider: " [Outsider] ",
      useInIndex: templer(" <%=outsider%> "),
      index: " <%=useInIndex({outsider:outsider})%> "
    });
    return assert(tmpl().indexOf("[Outsider]"), "should pass ctx to sub tmpl");
  });
  it("should extend with super method", function() {
    var tmpl;
    tmpl = templer({
      index: "hello world"
    }).extend({
      index: "before <%=_parent.index%> after"
    });
    return assert.equal(tmpl(), "before hello world after", "should wrap with super");
  });
  it("should invoke", function() {
    var tmpl;
    tmpl = templer({
      index: "hello <%=invoke(name, {msg:'invokename'})%>",
      name: "<%=msg%>"
    });
    return assert.equal(tmpl(), "hello invokename");
  });
  it("should use args", function() {
    var tmpl;
    tmpl = templer("<%=args.join('')%>");
    return assert.equal(tmpl(1, 2, 3), "123", "check use args");
  });
  return it("should use _super ", function() {
    var tmpl;
    tmpl = templer({
      index: "hello <%=world%>"
    }).extend({
      index: "before <%=_super()%>"
    });
    return assert.equal(tmpl(), "before hello");
  });
});
