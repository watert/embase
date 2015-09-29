define ["tmpls/base"], (base)->
    base.extend
        userSection: """
            <div class="topbar-user">
                <% var user = DATA.user; %>
                <%if(user){ console.log("hasuser", DATA.user)%>
                    <span class="btn btn-add"> Add </span>
                     <img src="<%=user.avatar%>" alt="" /> <%-user.name%>
                <%}else { var redirect = encodeURIComponent(location.href) %>
                    <a href="/usercenter/login/?redirect=<%=redirect%>"> Login </a>
                <% }%>
            </div>
        """
        pageTopbar: """
            <div class="page-topbar">
                <strong>My Codebase</strong>
                <div>
                    <%=invoke(userSection)%>
                </div>
            </div>
        """
