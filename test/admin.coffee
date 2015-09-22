{DBStore, assert, _, User, UserDoc} = require("./base")


describe "test admin special actions", ()->
    it "should get admin status", ->
        DBStore.dbStatus().then (data)->
            assert(data.length, "check has dbStatus")
