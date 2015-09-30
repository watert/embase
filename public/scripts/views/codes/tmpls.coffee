define ["tmpls/base"], (base)->
    base.extend
        userSection: """
            <div class="topbar-user">
                <% var user = DATA.user; %>
                <%if(user){ console.log("hasuser", DATA.user)%>
                    <span class="btn btn-add"> Add </span>
                    <div class="avatar">
                        <img src="<%=user.avatar%>" alt="" title="<%-user.name%>"/>
                    </div>
                <%}else { var redirect = encodeURIComponent(location.href) %>
                    <a href="/usercenter/login/?redirect=<%=redirect%>"> Login </a>
                <% }%>
            </div>
        """
        pageTopbar: """
            <div class="page-topbar">
                <strong><%=title%></strong>
                <div>
                    <%=invoke(userSection)%>
                </div>
            </div>
        """
