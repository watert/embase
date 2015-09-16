define ["./base.js", "models/user"], (testBase, User)->
    {assert, retFail, chai} = testBase
    {UserDocs} = User

    describe "User and UserDocs", ->
        describe "User Base", ->
            userData = {name:"xxxx1", email:"xx@asd.com", password:"xxx"}
            user = null
            it "should call register", ->
                User.call("register", userData).then (ret)-> user = ret
            it "should call login", ->
                User.call("login",userData).then ()->
                    (user = new User).fetch()
                .then (ret)->
            it "should get Profile", ->
                User.get().then (u)->
                    assert.equal(u.get("email"), userData.email, "user get info")
            after "delete user", ->
                user.destroy()

        describe "User Doc", ->
            docData = {title:"hello world", content:"content"}
            doc = null
            it "should create a doc", ->
                doc = UserDocs.create(docData)
                # console.log "created doc",doc
                doc.save().then (data)->
                    console.log "userdoc data",data
            it "should fetch docs", ->
                list = null
                UserDocs.create(docData).save().then ->
                    (list = new UserDocs).fetch()
                .then ()-> assert(list.length)
            it "should update a doc", ->
                doc = UserDocs.create(docData)
                doc.save().then ->
                    doc.save({title:"hello2"})
                .then ->
                    assert.equal(doc.get("title"), "hello2", "should update doc")
            it "should remove a doc", ->
                doc = UserDocs.create(docData)
                doc.save().then ->
                    doc.destroy()

        describe "User Files", ->
            it "upload file with user"
            it "list files with user"
            it "list images files with user"
            it "modify files with user"
            it "delete files with user"
    # dfd.resolve()
    return $.when(1)
