var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["./base.js"], function(testBase) {
  var User, UserDocs, assert, chai, retFail;
  assert = testBase.assert, retFail = testBase.retFail, chai = testBase.chai;
  UserDocs = (function(superClass) {
    var UserDocModel;

    extend(UserDocs, superClass);

    function UserDocs() {
      return UserDocs.__super__.constructor.apply(this, arguments);
    }

    UserDocs.storeName = "article";

    UserDocs.prototype.idAttribute = "_id";

    UserDocs.prototype.url = function() {
      return "/user/docs/" + (this.storeName || this.constructor.storeName) + "/";
    };

    UserDocs.prototype.model = UserDocModel = (function(superClass1) {
      extend(UserDocModel, superClass1);

      function UserDocModel() {
        return UserDocModel.__super__.constructor.apply(this, arguments);
      }

      UserDocModel.prototype.idAttribute = "_id";

      UserDocModel.prototype.parse = function(data) {
        return data.result || data;
      };

      return UserDocModel;

    })(Backbone.Model);

    UserDocs.prototype.parse = function(data) {
      return data.result || data;
    };

    UserDocs.create = function(data) {
      var docs;
      (docs = new this).add(data);
      return docs.at(0);
    };

    return UserDocs;

  })(Backbone.Collection);
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
  describe("User and UserDocs", function() {
    describe("User Base", function() {
      var user, userData;
      userData = {
        name: "xxxx1",
        email: "xx@asd.com",
        password: "xxx"
      };
      user = null;
      it("should call register", function() {
        return User.call("register", userData).then(function(ret) {
          return user = ret;
        });
      });
      it("should call login", function() {
        return User.call("login", userData).then(function() {
          return (user = new User).fetch();
        }).then(function(ret) {});
      });
      it("should get Profile", function() {
        return User.get().then(function(u) {
          return assert.equal(u.get("email"), userData.email, "user get info");
        });
      });
      return after("delete user", function() {
        return user.destroy();
      });
    });
    describe("User Doc", function() {
      var doc, docData;
      docData = {
        title: "hello world",
        content: "content"
      };
      doc = null;
      it("should create a doc", function() {
        doc = UserDocs.create(docData);
        return doc.save().then(function(data) {
          return console.log("userdoc data", data);
        });
      });
      it("should fetch docs", function() {
        var list;
        list = null;
        return UserDocs.create(docData).save().then(function() {
          return (list = new UserDocs).fetch();
        }).then(function() {
          return assert(list.length);
        });
      });
      it("should update a doc", function() {
        doc = UserDocs.create(docData);
        return doc.save().then(function() {
          return doc.save({
            title: "hello2"
          });
        }).then(function() {
          return assert.equal(doc.get("title"), "hello2", "should update doc");
        });
      });
      return it("should remove a doc", function() {
        doc = UserDocs.create(docData);
        return doc.save().then(function() {
          console.log("try destroy", doc, doc.destroy);
          return doc.destroy();
        });
      });
    });
    return describe("User Files", function() {
      it("upload file with user");
      it("list files with user");
      it("list images files with user");
      it("modify files with user");
      return it("delete files with user");
    });
  });
  return $.when(1);
});
