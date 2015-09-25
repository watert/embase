assert = console.assert.bind(console)
{User} = App
describe "User Actions", ->
    userData = {name:"xxxx1", email:"xx@asd.com", password:"xxx"}
    it "should has user module", ->
        console.log User
        assert(App.User)
    it "should register", ->
        User.register(userData).then (user)->
            assert(user.id, "register")
    it "should login", ->
        User.login(userData).then (user)->
            assert(user.id, "login fail")

    it "should get profile", ->
        User.profile().then (user)->
            assert(user.id, "login fail")
    it "should update profile", ->
        User.profile().then (user)->
            user.save({name:"xxxx2"}).then ->
                assert(user.get("name") == "xxxx2", "update name")
    it "should remove user", ->
        User.profile().then (user)->
            console.log user
            user.destroy()
