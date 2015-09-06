# DBStore = require("nedb")

{BaseDoc, DBStore} = require("../server/models/db")
{assert} = require("chai")
_ = require("underscore")

UserDoc = require("../server/models/user")
# class UserDoc extends BaseDoc
#     @store: "user"

describe "Main", ->
    _storePath = DBStore.storePath
    DBStore.storePath = (name)-> _storePath(name+"_test")
    getStore = DBStore.getStore

    describe "With ODM", ->
        data = name:"testing", email:"x@x.com"
        it "should create user", ->
            user = new UserDoc(data)
            user.save().then (doc)->
                assert.equal(doc.name,data.name,"should insert right name")
        it "should update user", ->
            (user = new UserDoc(data)).save()
            .then -> user.save({"name": "testing2"})
            .then -> assert.equal(user._data.name, "testing2", "check update value setted")
        it "should delete user", ->
            (user = new UserDoc(data)).save()
            .then (doc)-> user.remove()
            .then (data)->
                assert(data, "check delete after save")
        it "findByID", ->
            (user = new UserDoc(data)).save().then ->
                assert(id = user._data._id, "has id")
                UserDoc.findByID(id)
            .then (newUser)->
                assert(newUser._data, "check find by id")
        it "removeByID", ->
            (user = new UserDoc(data)).save().then ->
                UserDoc.removeByID(user.id)
            .then (num)-> assert(num, "check remove item count")

    describe "User Basic Actions", ->
        it "hash", ->
            assert.equal UserDoc.hash("braitsch"),"9b74c9897bac770ffc029102a200c5de",
                "check password hash algorithm"
        it "register and login", ->
            data = name:"testuser2", email:"x@x1.com", password:"braitsch"
            UserDoc.register(data).then (user)->
                UserDoc.login(data)
            .then (user)->
        it "register with same name", (done)->
            data = name:"testuser3", email:"xx@xx.com", password:"braitsch"
            # assert.ok(no, "msg")
            UserDoc.register(data).then ->
                UserDoc.register(data)
            .catch (err)->
                assert.equal(err.code, 400 , "shit")
                done()
    after "NeDB destroy", ()->
        fs = require("fs")
        fs.unlinkSync(DBStore.storePath("user"))

describe "extendable template", ->
    templer = require("../app/libs/templer")
    it "should templer work", ->
        tmpl = templer(index:"hello <%=name%>", name:"world")
        assert.equal(tmpl(), "hello world")

        newTmpl = tmpl.extend(name:tmpl.get("name")+"2")
        assert.equal(newTmpl(), "hello world2")
    it "should templer define and require work", ->
        templer.define("shit", "shit tmpl")
        html = templer.require("shit")()
        assert.equal(html,"shit tmpl","check require works")
    it "should inline require work", ->
        templer.define("hello", "hello <%=require('world')%>")
        templer.define("world", "WORLD")
        assert.equal(templer.require("hello")(), "hello WORLD", "check inline require")
describe "action dispatcher", ->
    dispatcher = require("../app/libs/action-dispatcher")
    it "should dispatcher add action", ->
        console.log _.methods dispatcher
        dispatcher.addActions
            a: ()-> "hello"
        dispatcher.call("a").then (val)->
            assert.equal(val, "hello", "a action")
