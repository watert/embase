var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base"], function(BaseView, baseTmpls) {
  var UserIndex;
  return UserIndex = (function(superClass) {
    extend(UserIndex, superClass);

    function UserIndex() {
      return UserIndex.__super__.constructor.apply(this, arguments);
    }

    UserIndex.prototype.model = Backbone.Model.extend({
      defaults: {
        email: "",
        name: ""
      }
    });

    UserIndex.prototype.url = "/user/info/";

    UserIndex.prototype.render = function() {
      console.log(_.methods(this.template));
      return UserIndex.__super__.render.call(this, "login");
    };

    UserIndex.prototype.parse = function(data) {
      return data.result;
    };

    UserIndex.prototype.template = baseTmpls.extend({
      index: "Hello User",
      login: "Login View <%=index%>"
    });

    return UserIndex;

  })(BaseView);
});
