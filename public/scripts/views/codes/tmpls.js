define(["tmpls/base"], function(base) {
  return base.extend({
    userSection: "<div class=\"topbar-user\">\n    <% var user = DATA.user; %>\n    <%if(user){ console.log(\"hasuser\", DATA.user)%>\n        <span class=\"btn btn-add\"> Add </span>\n        <div class=\"avatar\">\n            <img src=\"<%=user.avatar%>\" alt=\"\" title=\"<%-user.name%>\"/>\n        </div>\n    <%}else { var redirect = encodeURIComponent(location.href) %>\n        <a href=\"/usercenter/login/?redirect=<%=redirect%>\"> Login </a>\n    <% }%>\n</div>",
    pageTopbar: "<div class=\"page-topbar\">\n    <strong><%=title%></strong>\n    <div>\n        <%=invoke(userSection)%>\n    </div>\n</div>"
  });
});
