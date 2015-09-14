{DBStore} = require("../app/models/db")
_storePath = DBStore.storePath
DBStore.storePath = (name)-> _storePath(name+"_test")

{assert} = require("chai")
_ = require("underscore")

User = require("../app/models/user")
UserDoc = User.UserDoc

module.exports = {DBStore, assert, _, User, UserDoc}
