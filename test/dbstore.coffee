DB = require("nedb")
{assert} = require("chai")
# DataStore = require("nedb")
q = require("q")
fs = require("fs")
# {BaseDoc} = require("../app/models/db")
describe "DBStore", ->
    store = new DB(filename:"./test.db")
    it "should connect", ->
        q.ninvoke(store, "loadDatabase")
    it "should insert", ->
        q.ninvoke(store, "insert", {name:"hello"})
    it "should find", ->
        act = store.find({}).sort(_id:-1)
        q.ninvoke(act,"exec").then (data)->
            console.log "find", data

        # q.ninvoke(store, "find").then (data)->
        #     console.log "find", data
describe "nedb bug?", ->
    it "should crash", ->
        DB = require("nedb")
        _ = require("underscore")
        q = require("q")
        db = new DB(filename:"./testremove.db", autoload:yes)
        q.when().then ->
            records = _.map(_.range(1000), -> {title:"hello"+(new Date).getTime()})
            q.ninvoke(db, "insert", records)
        .then ->
            act = db.find()
            q.ninvoke(act, "exec")
        .then (data)->
            dfds = _.map data, (row)->
                console.log "remove", row
                q.ninvoke(db,"remove",row)
            q.when(dfds)
