var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base"], function(BaseView, tmpls) {
  var CodesIndexView;
  return CodesIndexView = (function(superClass) {
    extend(CodesIndexView, superClass);

    function CodesIndexView() {
      return CodesIndexView.__super__.constructor.apply(this, arguments);
    }

    CodesIndexView.prototype.template = tmpls.extend({
      userSection: "<%if(DATA.user){ console.log(\"hasuser\", DATA.user)%>\n    hasUser\n<%}else {\n    var redirect = encodeURIComponent(location.href)\n%>\n    <a href=\"/usercenter/login/?redirect=<%=redirect%>\"> Login </a>\n<% }%>",
      index: "<div class=\"container flexbox space-between\">\n    <strong>My Codebase</strong>\n    <div>\n        <%=invoke(userSection)%>\n    </div>\n</div>\n<hr />\n"
    });

    return CodesIndexView;

  })(BaseView);
});
