define(["./base.js", "models/user"], function(testBase, User) {
  var UserDocs, assert, chai, retFail;
  assert = testBase.assert, retFail = testBase.retFail, chai = testBase.chai;
  UserDocs = User.UserDocs;
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
      var user, userData;
      userData = {
        name: "xxxx1",
        email: "xx@asd.com",
        password: "xxx"
      };
      user = null;
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
        var blob, formData, url;
        formData = new FormData();
        blob = new Blob(["Hello World"], {
          type: "text/plain"
        });
        console.log(blob);
        formData.append("file", blob, "hello.txt");
        $.upload = function(url, formData) {
          return $.ajax({
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            type: "POST"
          });
        };
        url = "/user/files/";
        return $.upload(url, formData).then(function(data) {
          return console.log("uploaded to ", url, data);
        });
      });
      it("list files with user");
      it("list images files with user");
      it("modify files with user");
      return it("delete files with user");
    });
  });
  return $.when(1);
});
