define ["views/_base/view","tmpls/base"],(BaseView, tmpls)->
    class User extends Backbone.Model
        defaults: {email:"",name:""}
        url: "/users/api/restful"

    class UserDetail extends BaseView
        template: tmpls.extend
            indexBody: """
                <div class="tableview">
                    <div class="tableview-header">
                        Base Info
                    </div>
                    <div>
                        <%invoke(function(){%>
                            Invoked content
                        <%});%>
                    </div>
                </div>
            """
