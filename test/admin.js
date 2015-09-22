var DBStore, User, UserDoc, _, assert, ref;

ref = require("./base"), DBStore = ref.DBStore, assert = ref.assert, _ = ref._, User = ref.User, UserDoc = ref.UserDoc;

describe("test admin special actions", function() {
  return it("should get admin status", function() {
    return DBStore.dbStatus().then(function(data) {
      return assert(data.length, "check has dbStatus");
    });
  });
});
