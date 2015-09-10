define ["views/_base/view","tmpls/base"],(BaseView, tmpls)->
    class User extends Backbone.Model
        defaults: {email:"",name:""}
        urlRoot: "/users/api/restful"
        parse: (data)-> data.result
    class UserDetail extends BaseView
        render: ->
            if id = @query.id
                user = @user = new User(id:id)
                user.fetch().then =>
                    console.log user.toJSON()
                    @setModel(user: user.toJSON())
                    super()
            else
                user = @user = new User()
                @setModel(user:user.toJSON())
                super()
        template: tmpls.extend
            userCells: ["""
                <div class="key"> Name </div>
                <input type="text" value="<%=user.name%>"/>
            ""","""
                <div class="key"> Email </div>
                <input type="email" value="<%=user.email%>"/>
            """]
            actions: [
                '<div class="btn-save">Save</div>',
                '<div class="btn-remove text-danger">Remove</div>'
            ]
            h1: "<h1>Hello</h1>"
            indexBody: """
                <div class="tableview">
                    <%= invoke(tableview, {header:"Base Info", cells:userCells}) %>
                    <%= invoke(tableview, {header:"Actions", cells:actions}) %>
                </div>
            """
