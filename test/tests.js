var BaseDoc, DBStore, UserDoc, _, assert, ref,
  slice = [].slice;

ref = require("../server/models/db"), BaseDoc = ref.BaseDoc, DBStore = ref.DBStore;

assert = require("chai").assert;

_ = require("underscore");

UserDoc = require("../server/models/user");

describe("Main", function() {
  var _storePath, getStore;
  _storePath = DBStore.storePath;
  DBStore.storePath = function(name) {
    return _storePath(name + "_test");
  };
  getStore = DBStore.getStore;
  describe("With ODM", function() {
    var data;
    data = {
      name: "testing",
      email: "x@x.com"
    };
    it("should create user", function() {
      var user;
      user = new UserDoc(data);
      return user.save().then(function(doc) {
        return assert.equal(doc.name, data.name, "should insert right name");
      });
    });
    it("should update user", function() {
      var user;
      return (user = new UserDoc(data)).save().then(function() {
        return user.save({
          "name": "testing2"
        });
      }).then(function() {
        return assert.equal(user._data.name, "testing2", "check update value setted");
      });
    });
    it("should delete user", function() {
      var user;
      return (user = new UserDoc(data)).save().then(function(doc) {
        return user.remove();
      }).then(function(data) {
        return assert(data, "check delete after save");
      });
    });
    it("findByID", function() {
      var user;
      return (user = new UserDoc(data)).save().then(function() {
        var id;
        assert(id = user._data._id, "has id");
        return UserDoc.findByID(id);
      }).then(function(newUser) {
        return assert(newUser._data, "check find by id");
      });
    });
    return it("removeByID", function() {
      var user;
      return (user = new UserDoc(data)).save().then(function() {
        return UserDoc.removeByID(user.id);
      }).then(function(num) {
        return assert(num, "check remove item count");
      });
    });
  });
  describe("User Basic Actions", function() {
    it("hash", function() {
      return assert.equal(UserDoc.hash("braitsch"), "9b74c9897bac770ffc029102a200c5de", "check password hash algorithm");
    });
    it("register and login", function() {
      var data;
      data = {
        name: "testuser2",
        email: "x@x1.com",
        password: "braitsch"
      };
      return UserDoc.register(data).then(function(user) {
        return UserDoc.login(data);
      }).then(function(user) {});
    });
    return it("register with same name", function(done) {
      var data;
      data = {
        name: "testuser3",
        email: "xx@xx.com",
        password: "braitsch"
      };
      return UserDoc.register(data).then(function() {
        return UserDoc.register(data);
      })["catch"](function(err) {
        assert.equal(err.code, 400, "shit");
        return done();
      });
    });
  });
  return after("NeDB destroy", function() {
    var fs;
    fs = require("fs");
    return fs.unlinkSync(DBStore.storePath("user"));
  });
});

describe("composable template", function() {
  it("should create tmpl", function() {
    var data, layout, result, tmpl;
    layout = "hello\n<%= block(\"body\") %>\n[end].";
    tmpl = _.template(layout);
    data = {
      block: function(name, method) {
        var after, before, ret;
        ret = this.blocks[name] || "";
        if (before = this.blocks["body:before"]) {
          ret = before + ret;
        }
        if (after = this.blocks["body:after"]) {
          ret += after;
        }
        return ret;
      },
      blocks: {
        "body": "block body 2",
        "body:before": "before body,"
      }
    };
    result = tmpl(data);
    return assert(-1 !== result.indexOf(data.blocks["body:before"] + data.blocks["body"]));
  });
  it("should have a Blocks class", function() {
    var Blocks, tmpl;
    Blocks = (function() {
      function Blocks(options) {
        var tmpl;
        tmpl = _.template(options.index);
        return (function(_this) {
          return function(data) {
            var config, method;
            _this.blocks = _.extend(_this.blocks, (data != null ? data.blocks : void 0) || {});
            data = _.omit(data, "blocks");
            method = tmpl.bind(_this);
            config = _.extend(_this, data);
            return method(config);
          };
        })(this);
      }

      Blocks.prototype.blocks = {
        name: "world"
      };

      Blocks.prototype.block = function(name, method) {
        var after, before, ref1, ret;
        ret = ((ref1 = this.blocks) != null ? ref1[name] : void 0) || "";
        if (before = this.blocks["body:before"]) {
          ret = before + ret;
        }
        if (after = this.blocks["body:after"]) {
          ret += after;
        }
        return ret;
      };

      return Blocks;

    })();
    return tmpl = new Blocks({
      index: "<%=a%>hello <%=block('name')%>"
    });
  });
  it("should Templer work", function() {
    var newTmpl, templer, tmpl;
    templer = function(options) {
      var ctx, tmpl, tmplMethod;
      if (options == null) {
        options = {};
      }
      tmpl = _.template(options.index);
      ctx = _.extend({}, tmpl, options);
      tmplMethod = function() {
        var args, data;
        data = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        data = _.extend({}, ctx, data);
        return tmpl.bind(ctx).apply(null, [data].concat(slice.call(args)));
      };
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
    tmpl = templer({
      index: "hello <%=name%>",
      name: "world"
    });
    newTmpl = tmpl.extend({
      name: tmpl.get("name") + "2"
    });
    console.log(tmpl(), _.keys(tmpl), tmpl.get("name"));
    return console.log(newTmpl());
  });

  /* tmpls should like
  //Layout part
  <head></head>
  <%=body(data)%>
  <div class="footer">
      <%=block("footer","%>
          default footer html
      <%");%>
  </div>
   */
  it(" `Layout.extend({body:\"body tmpl str\"})` ");
  return it(" `NewTmpl.exec(data)` ");
});
