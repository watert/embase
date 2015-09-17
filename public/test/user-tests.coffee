define ["./base.js", "models/user"], (testBase, User)->
    {assert, retFail, chai} = testBase
    {UserDocs} = User
    class UserFile extends Backbone.Model
        @uploadWithForm:(form)->
            upload = (formData)=>
                $.ajax(url:@prototype.urlRoot, data:formData, processData:no
                    ,contentType:no, type:"POST")
            if form instanceof FormData
                return upload(form)
            else if form instanceof jQuery
                return upload(new FormData(form[0]))
            else $.Deferred().reject("uploadWithForm must call with jquery form or FormData")
        urlRoot: "/user/files/"
        parse: (data)-> data.result
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
            userData = {name:"xxxx1", email:"xx@asd.com", password:"xxx"}
            user = null
            before "create user", (done)->
                User.call("register", userData).always (ret)->
                    User.call("login",userData).then (_user)->
                        user = _user
                        done()
            after "delete user", ->
                user.destroy()
            docData = {title:"hello world", content:"content"}
            doc = null
            it "should create a doc", ->
                doc = UserDocs.create(docData)
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
            it "should count docs", ->
                UserDocs.call("count").then (ret)-> assert(ret.count)
            it "should remove a doc", ->
                doc = UserDocs.create(docData)
                doc.save().then ->
                    doc.destroy()

            describe "User Files", ->
                createForm = (ext="txt")->
                    formData = new FormData()
                    blob = new Blob(["Hello World"], type:"text/plain");
                    formData.append("file", blob, "hello.#{ext}")
                    return formData
                it "upload file with user", ->
                    UserFile.uploadWithForm(createForm("md"))

                it "list files with user"
                it "list images files with user"
                it "modify files with user"
                it "delete files with user"
            describe "User Status", ->
                before "add records to userdoc", ->
                    save = -> UserDocs.create(docData).save()
                    save().then -> save()
                it "should get status", ->
                    User.call("status").then (data)->
                        console.log "user status", data
    # dfd.resolve()
    return $.when(1)
