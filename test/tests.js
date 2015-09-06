var BaseDoc, DBStore, UserDoc, _, assert, ref;

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

describe("extendable template", function() {
  var templer;
  templer = require("../app/libs/templer");
  it("should templer work", function() {
    var newTmpl, tmpl;
    tmpl = templer({
      index: "hello <%=name%>",
      name: "world"
    });
    assert.equal(tmpl(), "hello world");
    newTmpl = tmpl.extend({
      name: tmpl.get("name") + "2"
    });
    return assert.equal(newTmpl(), "hello world2");
  });
  it("should templer define and require work", function() {
    var html;
    templer.define("shit", "shit tmpl");
    html = templer.require("shit")();
    return assert.equal(html, "shit tmpl", "check require works");
  });
  return it("should inline require work", function() {
    templer.define("hello", "hello <%=require('world')%>");
    templer.define("world", "WORLD");
    return assert.equal(templer.require("hello")(), "hello WORLD", "check inline require");
  });
});

describe("action dispatcher", function() {
  var dispatcher;
  dispatcher = require("../app/libs/action-dispatcher");
  return it("should load dispatcher", function() {
    return dispatcher.addActions({
      a: function() {
        return "hello";
      }
    });
  });
});
