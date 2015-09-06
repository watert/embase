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
describe "composable template", ->
    it "should create tmpl", ->
        layout = """
            hello
            <%= block("body") %>
            [end].
        """
        tmpl = _.template(layout)
        data =
            block:(name, method)->
                ret = @blocks[name] or ""
                if before = @blocks["body:before"]
                    ret = before + ret
                if after = @blocks["body:after"]
                    ret += after
                return ret
            blocks:
                "body":"block body 2"
                "body:before":"before body,"

        result = tmpl(data)
        assert(-1 isnt result.indexOf(data.blocks["body:before"]+data.blocks["body"]))
    it "should have a Blocks class", ->
        class Blocks
            constructor:(options)->
                tmpl = _.template(options.index)
                return (data)=>
                    @blocks = _.extend(@blocks, data?.blocks or {})
                    data = _.omit(data, "blocks")
                    method = tmpl.bind(this)
                    config = _.extend(@,
                        data
                    )
                    method(config)
            blocks:
                name: "world"
            block:(name, method)->
                ret = @blocks?[name] or ""
                if before = @blocks["body:before"]
                    ret = before + ret
                if after = @blocks["body:after"]
                    ret += after
                return ret
        # create tmpl
        tmpl = new Blocks({
            index:"<%=a%>hello <%=block('name')%>"
            })
        # use tmpl
        console.log "result:",tmpl
            a:123
            blocks:
                name:"world2"
    ### tmpls should like
    //Layout part
    <head></head>
    <%=body(data)%>
    <div class="footer">
        <%=block("footer","%>
            default footer html
        <%");%>
    </div>


    ###
    it """ `Layout.extend({body:"body tmpl str"})` """
    it """ `NewTmpl.exec(data)` """
