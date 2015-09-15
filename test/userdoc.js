var DBStore, User, UserDoc, UserFile, _, assert, fs, path, q, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require("./base"), DBStore = ref.DBStore, assert = ref.assert, _ = ref._, User = ref.User, UserDoc = ref.UserDoc;

fs = require('fs');

path = require('path');

q = require("q");

UserFile = (function(superClass) {
  extend(UserFile, superClass);

  function UserFile() {
    return UserFile.__super__.constructor.apply(this, arguments);
  }

  UserFile.store = "userfiles";

  UserFile.prototype.remove = function() {
    return q.nfcall(fs.unlink, this.get("path")).then((function(_this) {
      return function() {
        return UserFile.__super__.remove.call(_this);
      };
    })(this));
  };

  UserFile.prototype.save = function(data) {
    var extname, fname, getTarget, getUrl, source;
    if (data == null) {
      data = null;
    }
    if (data == null) {
      data = this._data;
    }
    source = data.file;
    fname = path.basename(source);
    extname = path.extname(fname).slice(1);
    getUrl = function(id) {
      return "uploads/" + id + "." + extname;
    };
    getTarget = function(id) {
      return __dirname + "/../public/" + (getUrl(id));
    };
    return q.nfcall(fs.stat, source).then((function(_this) {
      return function(info) {
        var fdoc, stat;
        fdoc = {
          fname: fname,
          extname: extname
        };
        stat = _.pick(info, "mtime", "size", "ctime");
        fdoc = _.extend(fdoc, data, stat);
        _this.set(fdoc);
        _this.omit("file");
        return UserFile.__super__.save.call(_this);
      };
    })(this)).then((function(_this) {
      return function(doc) {
        var id, target, url;
        id = doc.id;
        assert.isString(id, "has id");
        target = getTarget(id);
        url = getUrl(id);
        _this.set({
          path: target,
          url: url
        });
        return UserFile.__super__.save.call(_this);
      };
    })(this)).then(function(doc) {
      return q.nfcall(fs.rename, source, getTarget(doc.id));
    });
  };

  return UserFile;

})(UserDoc);

describe("Other Doc with User", function() {
  var user, user_data;
  user_data = {
    name: "user_doc2",
    email: "user_doc2@x.com",
    password: "testuserdoc"
  };
  user = null;
  before("Create User", function() {
    return User.register(user_data).then(function(_user) {
      return user = _user;
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
    return it("should fetch by user", function() {
      return UserDoc.find({
        user_id: user.id
      }).then(function(data) {
        return assert(data[0].user_id === user.id, "check find user doc only");
      });
    });
  });
  return describe("User Files ", function() {
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
});
