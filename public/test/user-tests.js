var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["./base.js", "models/user"], function(testBase, User) {
  var UserDocs, UserFile, assert, chai, retFail;
  assert = testBase.assert, retFail = testBase.retFail, chai = testBase.chai;
  UserDocs = User.UserDocs;
  UserFile = (function(superClass) {
    extend(UserFile, superClass);

    function UserFile() {
      return UserFile.__super__.constructor.apply(this, arguments);
    }

    UserFile.uploadWithForm = function(form) {
      var upload;
      upload = (function(_this) {
        return function(formData) {
          console.log("@prototype.urlRoot", _this.prototype.urlRoot, formData);
          return $.ajax({
            url: _this.prototype.urlRoot,
            data: formData,
            processData: false,
            contentType: false,
            type: "POST"
          });
        };
      })(this);
      if (form instanceof FormData) {
        return upload(form);
      } else if (form instanceof jQuery) {
        return upload(new FormData(form[0]));
      } else {
        return $.Deferred().reject("uploadWithForm must call with jquery form or FormData");
      }
    };

    UserFile.prototype.urlRoot = "/user/files/";

    UserFile.prototype.parse = function(data) {
      return data.result;
    };

    return UserFile;

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
          return doc.destroy();
        });
      });
    });
    return describe("User Files", function() {
      var createForm, user, userData;
      userData = {
        name: "xxxx1",
        email: "xx@asd.com",
        password: "xxx"
      };
      user = null;
      createForm = function(ext) {
        var blob, formData;
        if (ext == null) {
          ext = "txt";
        }
        formData = new FormData();
        blob = new Blob(["Hello World"], {
          type: "text/plain"
        });
        formData.append("file", blob, "hello." + ext);
        return formData;
      };
      before("create user", function(done) {
        return User.call("register", userData).always(function(ret) {
          return User.call("login", userData).then(function(_user) {
            user = _user;
            return done();
          });
        });
      });
      after("delete user", function() {
        return user.destroy();
      });
      it("upload file with user", function() {
        return UserFile.uploadWithForm(createForm("md"));
      });
      it("list files with user");
      it("list images files with user");
      it("modify files with user");
      return it("delete files with user");
    });
  });
  return $.when(1);
});
