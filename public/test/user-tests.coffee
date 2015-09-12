define ["./base.js"], (testBase)->
    {assert, retFail, chai} = testBase

    class UserDocs extends Backbone.Collection
        @storeName: "article"
        url: -> "/user/docs/#{@storeName or @constructor.storeName}/"
        model: class UserDocModel extends Backbone.Model
            parse: (data)-> data.result or data
        parse: (data)-> data.result or data
        @create: (data)->
            (docs = new @).add(data)
            docs.at(0)
    class User extends Backbone.Model
        idAttribute: "_id"
        urlRoot: "/user/api/"
        @get: ()->
            (user = new User).fetch().then ->
                return user
        @urlApi: (method)->
            "#{@prototype.urlRoot}#{method}"
        @call:(method, data={})->
            url = @urlApi(method)
            $.post(url, data).then (data)->
                # console.log data.length
                return new User(data.result)
        parse:(data)-> return data.result

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
                console.log "created doc",doc
                doc.save().then (data)->
                    console.log "userdoc data",data

    # dfd.resolve()
    return $.when(1)
