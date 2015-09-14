var DBStore, User, UserDoc, _, assert, ref;

ref = require("./base"), DBStore = ref.DBStore, assert = ref.assert, _ = ref._, User = ref.User, UserDoc = ref.UserDoc;

describe("Other Doc with User", function() {
  var user, user_data;
  user_data = {
    name: "test_user_doc",
    email: "test_user_doc@x.com",
    password: "testuserdoc"
  };
  user = null;
  before("Create User", function() {
    return User.register(user_data).then(function(_user) {
      return user = _user;
    });
  });
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
  return after("Remove User", function() {
    return user.remove();
  });
});
