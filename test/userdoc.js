var DBStore, User, UserDoc, UserFile, _, assert, fs, path, q, ref;

ref = require("./base"), DBStore = ref.DBStore, assert = ref.assert, _ = ref._, User = ref.User, UserDoc = ref.UserDoc;

UserFile = User.UserFile;

console.log("# userdoc tests");

fs = require('fs');

path = require('path');

q = require("q");

describe("Other Doc with User", function() {
  var user, user_data;
  user_data = {
    name: "user_doc2",
    email: "user_doc2@x.com",
    password: "testuserdoc"
  };
  user = null;
  before("Create User", function() {
    return User.remove({}, {
      multi: true
    }).then(function() {
      return User.register(user_data).then(function(_user) {
        return user = _user;
      });
    });
  });
  describe("User Doc Base", function() {
    it("should fail create a doc without user", function() {
      var doc;
      doc = new UserDoc({
        title: "hello"
      });
      return doc.save().fail(function(data) {
        return assert(data.error.code === 400, "check must have user with userdoc");
      });
    });
    it("should create a doc with user owns it", function() {
      var doc;
      doc = new UserDoc({
        user: user,
        title: "hello"
      });
      return doc.save().then(function(data) {
        return assert.equal(doc.get("title"), "hello");
      });
    });
    it("should fetch by user", function() {
      return UserDoc.find({
        user_id: user.id
      }).then(function(data) {
        return assert(data[0].user_id === user.id, "check find user doc only");
      });
    });
    return it("should update", function() {
      var doc;
      doc = new UserDoc({
        user: user,
        title: "hello"
      });
      return doc.save().then(function(data) {
        return doc.set({
          "title": "helloxx"
        }).save();
      }).then(function() {
        return assert.equal(doc.get("title"), "helloxx", "check update userdoc");
      });
    });
  });
  describe("User Files ", function() {
    var createFile;
    createFile = function(ext) {
      var source;
      if (ext == null) {
        ext = "txt";
      }
      source = __dirname + "/testfile." + ext;
      fs.writeFileSync(source, "hello " + (new Date).getTime());
      return source;
    };
    it("should upload file", function() {
      var source, ufile;
      source = createFile();
      ufile = new UserFile({
        file: source,
        user: user
      });
      return ufile.save();
    });
    it("should list file", function() {
      var source, ufile;
      source = createFile("md");
      ufile = new UserFile({
        file: source,
        user: user
      });
      return ufile.save().then(function() {
        return UserFile.find({
          user_id: user.id
        }).then(function(data) {
          return assert(data.length);
        });
      });
    });
    it("should list with ext filter", function() {
      return UserFile.find({
        user_id: user.id,
        extname: "md"
      }).then(function(data) {
        return assert(data.length);
      });
    });
    it("should update file", function() {
      var source, ufile;
      source = createFile("md");
      ufile = new UserFile({
        file: source,
        user: user
      });
      return ufile.save().then(function() {
        return ufile.set({
          "title": "hello world"
        }).save();
      }).then(function() {
        return assert.equal(ufile.get("title"), "hello world");
      });
    });
    it("should delete file", function() {
      var ufile;
      ufile = new UserFile({
        file: createFile("md"),
        user: user
      });
      return ufile.save().then(function() {
        return ufile.remove();
      });
    });
    return after("Remove User", function() {
      return UserFile.find({
        user_id: user.id
      }).then(function(data) {
        var dfd;
        dfd = q.when();
        q.when(_.map(data, function(item) {
          return dfd = dfd.then(function() {
            return (new UserFile(item)).remove();
          });
        }));
        return dfd;
      }).then(function() {
        return user.remove();
      });
    });
  });
  return q.when(1);
});
