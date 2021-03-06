define ["./base.js"], (testBase)->
    {assert, retFail, chai} = testBase
    # {assert} = chai
    # dfd = $.Deferred()
    # retFail = (xhr)->
    #     {code, message} = xhr.responseJSON.error
    #     assert(false, "#{code}: #{message}")

    class User extends Backbone.Model
        idAttribute: "_id"
        urlRoot: "/admin/api/users"
        @urlApi: (method)->"/admin/api/users/#{method}"
        @call:(method, data={})->
            url = @urlApi(method)
            $.post(url, data).then (data)->
                console.log data.length
                return data
        parse:(data)-> return data.result or data
    class Users extends Backbone.Collection
        url: "/admin/api/users"
        model:User
        idAttribute: "_id"
        parse:(data)-> return data.result

    describe "User Admin Restful API",->
        it "should CREATE", ->
            user = new User({"name":"hello"})
            user.save().then (data)-> assert(user.id)
        it "should Query", ->
            users = new Users
            users.fetch().then -> assert(users.length)
        it "should Update Item", ->
            user = new User({"name":"hello"})
            user.save().then ->
                user.save({name:"xxxx"})
            .then ->
                assert.equal(user.get("name"),"xxxx","check update value")
        it "should Delete Item", ->
            user = new User({"name":"hello"})
            user.save().then ->
                user.destroy()
            .then (ret)->

                console.log user
                assert(ret.result,"check remove row count")
        it "should Read Item", ->
            user = new User({"name":"hello"})
            user.save().then ->
                user2 = new User(_id:user.id)
                user2.fetch()
            .then (ret)->
                console.log ret
        it "should call find", ->
            User.call("find").then ->
                console.log "find",arguments
    return $.when(1)
