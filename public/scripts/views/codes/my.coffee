define ["views/_base/view","tmpls/base"
],(BaseView, tmpls)->
    class CodesIndexView extends BaseView
        template: tmpls.extend
            userSection: """
                <%if(DATA.user){ console.log("hasuser", DATA.user)%>
                    hasUser
                <%}else {
                    var redirect = encodeURIComponent(location.href)
                %>
                    <a href="/usercenter/login/?redirect=<%=redirect%>"> Login </a>
                <% }%>
            """
            index: """
                <div class="container flexbox space-between">
                    <strong>My Codebase</strong>
                    <div>
                        <%=invoke(userSection)%>
                    </div>
                </div>
                <hr />

            """
