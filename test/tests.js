var BaseDoc, DBStore, UserDoc, _, assert, ref;

ref = require("../app/models/db"), BaseDoc = ref.BaseDoc, DBStore = ref.DBStore;

assert = require("chai").assert;

_ = require("underscore");

UserDoc = require("../app/models/user");

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
        assert.equal(user._data.name, "testing2", "check update value setted");
        return UserDoc.find({});
      }).then(function(data) {});
    });
    it("should delete user", function() {
      var user;
      return (user = new UserDoc(data)).save().then(function(doc) {
        return user.remove();
      }).then(function(data) {
        assert(data, "check delete after save");
        return UserDoc.find({});
      }).then(function(data) {});
    });
    it("UserDoc.find({})", function() {
      return UserDoc.find({}).then(function(data) {
        return data;
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
  describe("action dispatcher", function() {
    var Dispatcher, dispatcher;
    Dispatcher = require("../public/scripts/libs/action-dispatcher");
    dispatcher = new Dispatcher;
    it("should dispatcher add actions and call", function() {
      dispatcher.addActions({
        a: function() {
          return "hello";
        }
      });
      return dispatcher.call("a").then(function(val) {
        return assert.equal(val, "hello", "a action");
      });
    });
    return it("should wrap User as api", function() {
      var api, dfd;
      api = Dispatcher.createAPI(UserDoc, ["find"]);
      return dfd = api.call("find").then(function(data) {
        return assert(data.length, "find data");
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
  templer = require("../public/scripts/libs/templer");
  it("should templer work", function() {
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
      index: " <%=useInIndex()%> "
    });
    return assert(tmpl().indexOf("[Outsider]"), "should pass ctx to sub tmpl");
  });
  return it("should extend with super method", function() {
    var tmpl;
    tmpl = templer({
      index: "hello world"
    }).extend({
      index: function() {
        return "before " + this._super.index + " after";
      }
    });
    return assert.equal(tmpl(), "before hello world after", "should wrap with super");
  });
});
