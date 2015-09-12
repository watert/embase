define ["./base.js"], (testBase)->
    {assert, retFail, chai} = testBase

    describe "User Actions", ->
        class User extends Backbone.Model
            idAttribute: "_id"
            urlRoot: "/user/api"
            @urlApi: (method)->
                "#{@prototype.urlRoot}/#{method}"
            @call:(method, data={})->
                url = @urlApi(method)
                $.post(url, data).then (data)->
                    # console.log data.length
                    return new User(data)
            parse:(data)-> return data.result
        userData = {name:"xxxx1", email:"xx@asd.com", password:"xxx"}
        user = null
        it "should call register", ->
            User.call("register", userData).then (ret)->
                user=ret
                console.log user
        it "should call login", ->
            User.call("login",userData).then (ret)->
                user = ret
                console.log ret
        after "delete user", ->
            console.log user
            user.destroy()
    # dfd.resolve()
    return $.when(1)
