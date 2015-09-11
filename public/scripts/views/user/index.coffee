define ["views/_base/view","tmpls/base"],(BaseView, baseTmpls)->
    class UserIndex extends BaseView
        model: Backbone.Model.extend
            defaults: {email:"",name:""}
        url: "/user/info/"
        render: ->
            console.log _.methods(@template)
            super("login")
        parse: (data)-> data.result
        template: baseTmpls.extend
            index: "Hello User"
            login: "Login View <%=index%>"
