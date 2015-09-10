var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base"], function(BaseView, tmpls) {
  var User, UserDetail;
  User = (function(superClass) {
    extend(User, superClass);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.defaults = {
      email: "",
      name: ""
    };

    User.prototype.url = "/users/api/restful";

    return User;

  })(Backbone.Model);
  return UserDetail = (function(superClass) {
    extend(UserDetail, superClass);

    function UserDetail() {
      return UserDetail.__super__.constructor.apply(this, arguments);
    }

    UserDetail.prototype.template = tmpls.extend({
      indexBody: "<div class=\"tableview\">\n    <div class=\"tableview-header\">\n        Base Info\n    </div>\n    <div>\n        <%invoke(function(){%>\n            Invoked content\n        <%});%>\n    </div>\n</div>"
    });

    return UserDetail;

  })(BaseView);
});
