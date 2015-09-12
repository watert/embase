var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["./base.js"], function(testBase) {
  var User, Users, assert, chai, retFail;
  assert = testBase.assert, retFail = testBase.retFail, chai = testBase.chai;
  User = (function(superClass) {
    extend(User, superClass);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.idAttribute = "_id";

    User.prototype.urlRoot = "/users/api/restful";

    User.urlApi = function(method) {
      return "/users/api/" + method;
    };

    User.call = function(method, data) {
      var url;
      if (data == null) {
        data = {};
      }
      url = this.urlApi(method);
      return $.post(url, data).then(function(data) {
        console.log(data.length);
        return data;
      });
    };

    User.prototype.parse = function(data) {
      return data.result || data;
    };

    return User;

  })(Backbone.Model);
  Users = (function(superClass) {
    extend(Users, superClass);

    function Users() {
      return Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.url = "/users/api/restful";

    Users.prototype.model = User;

    Users.prototype.idAttribute = "_id";

    Users.prototype.parse = function(data) {
      return data.result;
    };

    return Users;

  })(Backbone.Collection);
  describe("User Admin Restful API", function() {
    it("should CREATE", function() {
      var user;
      user = new User({
        "name": "hello"
      });
      return user.save().then(function(data) {
        return assert(user.id);
      });
    });
    it("should Query", function() {
      var users;
      users = new Users;
      return users.fetch().then(function() {
        return assert(users.length);
      });
    });
    it("should Update Item", function() {
      var user;
      user = new User({
        "name": "hello"
      });
      return user.save().then(function() {
        return user.save({
          name: "xxxx"
        });
      }).then(function() {
        return assert.equal(user.get("name"), "xxxx", "check update value");
      });
    });
    it("should Delete Item", function() {
      var user;
      user = new User({
        "name": "hello"
      });
      return user.save().then(function() {
        return user.destroy();
      }).then(function(ret) {
        console.log(user);
        return assert(ret.result, "check remove row count");
      });
    });
    it("should Read Item", function() {
      var user;
      user = new User({
        "name": "hello"
      });
      return user.save().then(function() {
        var user2;
        user2 = new User({
          _id: user.id
        });
        return user2.fetch();
      }).then(function(ret) {
        return console.log(ret);
      });
    });
    return it("should call find", function() {
      return User.call("find").then(function() {
        return console.log("find", arguments);
      });
    });
  });
  return $.when(1);
});
