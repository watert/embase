define ["views/_base/view","tmpls/base"],(BaseView, baseTmpls)->
    class User extends Backbone.Model
        defaults: {email:"",name:""}
        url: "/user/api/"
    class UserIndex extends BaseView
        render: ->
            user = new User()
            user.fetch().then (data)->
                console.log data
            console.log _.methods(@template)
            super("login")
        parse: (data)-> data.result
        template: baseTmpls.extend
            index: "Hello User"
            login: "Login View <%=index%>"
