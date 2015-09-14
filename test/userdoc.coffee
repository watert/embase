{DBStore, assert, _, User, UserDoc} = require("./base")

describe "Other Doc with User", ->
    user_data = name:"test_user_doc", email:"test_user_doc@x.com", password:"testuserdoc"
    user = null
    before "Create User", ->
        User.register(user_data).then (_user)-> user = _user
    it "should fail create a doc without user", ->
        doc = new UserDoc(title:"hello")
        doc.save().fail (data)->
            assert(data.error.code is 400, "check must have user with userdoc")

    it "should create a doc with user owns it", ->
        # console.log UserDoc
        doc = new UserDoc(user:user, title:"hello")
        doc.save().then (data)->
            assert.equal(doc.get("title"), "hello")
    it "should fetch by user", ->
        UserDoc.find(user_id:user.id).then (data)->
            assert(data[0].user_id is user.id,"check find user doc only")
            # assert(data.length, "should find userdocs")
    after "Remove User", -> user.remove()
