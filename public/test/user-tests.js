var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["./base.js"], function(testBase) {
  var assert, chai, retFail;
  assert = testBase.assert, retFail = testBase.retFail, chai = testBase.chai;
  describe("User Actions", function() {
    var User, user, userData;
    User = (function(superClass) {
      extend(User, superClass);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      User.prototype.idAttribute = "_id";

      User.prototype.urlRoot = "/user/api/";

      User.get = function() {
        var user;
        return (user = new User).fetch().then(function() {
          return user;
        });
      };

      User.urlApi = function(method) {
        return "" + this.prototype.urlRoot + method;
      };

      User.call = function(method, data) {
        var url;
        if (data == null) {
          data = {};
        }
        url = this.urlApi(method);
        return $.post(url, data).then(function(data) {
          return new User(data.result);
        });
      };

      User.prototype.parse = function(data) {
        return data.result;
      };

      return User;

    })(Backbone.Model);
    userData = {
      name: "xxxx1",
      email: "xx@asd.com",
      password: "xxx"
    };
    user = null;
    it("should call register", function() {
      return User.call("register", userData).then(function(ret) {
        user = ret;
        return console.log(user);
      });
    });
    it("should call login", function() {
      return User.call("login", userData).then(function() {
        return (user = new User).fetch();
      }).then(function(ret) {
        return console.log("fetched", user);
      });
    });
    it("should get Profile", function() {
      return User.get().then(function(u) {
        console.log("User.get()", u);
        return assert.equal(u.get("email"), userData.email, "user get info");
      });
    });
    return after("delete user", function() {
      console.log("delete", user);
      return user.destroy();
    });
  });
  return $.when(1);
});
