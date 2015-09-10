# DBStore = require("nedb")

{BaseDoc, DBStore} = require("../app/models/db")
{assert} = require("chai")
_ = require("underscore")

UserDoc = require("../app/models/user")
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
                assert.equal(doc._data.name,data.name,"should insert right name")

        it "should update user", ->
            # data.name += "1"
            (user = new UserDoc(data)).save()
            .then -> user.save({"name": "testing2"})
            .then ->
                assert.equal(user._data.name, "testing2", "check update value setted")
                UserDoc.find({})
            .then (data)->
        it "should delete user", ->
            (user = new UserDoc(data)).save()
            .then (doc)->
                user.remove()
            .then (data)->
                assert(data, "check delete after save")
                UserDoc.find({})
            .then (data)->
        it "UserDoc.find({})", ->
            UserDoc.find({}).then (data)->
                return data
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
            .then ->
                # console.log "then", arguments
            .catch (err)->
                # console.log err
                assert.equal(err.error.code, 400 , "shit")
                done()

    describe "action dispatcher", ->
        Dispatcher = require("../public/scripts/libs/action-dispatcher")
        dispatcher = new Dispatcher
        it "should dispatcher add actions and call", ->
            dispatcher.addActions
                a: ()-> "hello"
            dispatcher.call("a").then (val)->
                assert.equal(val, "hello", "a action")
        # it "try find",->
        #     UserDoc.find({}).then (data)->
        #         console.log data
        it "should wrap User as api", ->
            # api = new Dispatcher()
            api = Dispatcher.createAPI(UserDoc, ["find"])
            dfd = api.call("find").then (data)->
                assert(data.length, "find data")

    after "NeDB destroy", ()->
        fs = require("fs")
        fs.unlinkSync(DBStore.storePath("user"))

describe "extendable template", ->
    templer = require("../public/scripts/libs/templer")
    it "should templer work", ->
        tmpl = templer(index:"hello <%=world%>", world:"world")
        assert.equal(tmpl(), "hello world")
        newTmpl = tmpl.extend(world:tmpl.world+"2")
        assert.equal(newTmpl(), "hello world2")
    it "should context deliver to sub templer", ->
        # console.log "====="
        tmpl = templer
            outsider: " [Outsider] "
            useInIndex: templer " <%=outsider%> "
            index:" <%=useInIndex()%> "
        assert(tmpl().indexOf("[Outsider]"), "should pass ctx to sub tmpl")
    it "should extend with super method", ->
        tmpl = templer({index: "hello world"}).extend
            index: -> "before #{@_super.index} after"
        assert.equal(tmpl(), "before hello world after", "should wrap with super")
