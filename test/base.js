var DBStore, User, UserDoc, _, _storePath, assert;

DBStore = require("../app/models/db").DBStore;

_storePath = DBStore.storePath;

DBStore.storePath = function(name) {
  return _storePath(name + "_test");
};

assert = require("chai").assert;

_ = require("underscore");

User = require("../app/models/user");

UserDoc = User.UserDoc;

console.log("try get UserDoc", User, UserDoc);

module.exports = {
  DBStore: DBStore,
  assert: assert,
  _: _,
  User: User,
  UserDoc: UserDoc
};
