{DBStore, assert, _, User, UserDoc} = require("./base")


describe "Other Doc with User", ->
    user_data = name:"test_user_doc", email:"test_user_doc@x.com", password:"testuserdoc"
    user = null
    before "Create User", ->
        User.register(user_data).then (_user)-> user = _user
    it "should create a doc with user owns it", ->
        # console.log UserDoc
        doc = new UserDoc(user:user, title:"hello")
        doc.save().then (data)->
            assert.equal(doc.get("title"), "hello")
    it "should fetch by user"
    after "Remove User", -> user.remove()
