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

    User.prototype.urlRoot = "/users/api/restful";

    User.prototype.parse = function(data) {
      return data.result;
    };

    return User;

  })(Backbone.Model);
  return UserDetail = (function(superClass) {
    extend(UserDetail, superClass);

    function UserDetail() {
      return UserDetail.__super__.constructor.apply(this, arguments);
    }

    UserDetail.prototype.render = function() {
      var id, user;
      if (id = this.query.id) {
        user = this.user = new User({
          id: id
        });
        return user.fetch().then((function(_this) {
          return function() {
            console.log(user.toJSON());
            _this.setModel({
              user: user.toJSON()
            });
            return UserDetail.__super__.render.call(_this);
          };
        })(this));
      } else {
        user = this.user = new User();
        this.setModel({
          user: user.toJSON()
        });
        return UserDetail.__super__.render.call(this);
      }
    };

    UserDetail.prototype.template = tmpls.extend({
      userCells: ["<div class=\"key\"> Name </div>\n<input type=\"text\" value=\"<%=user.name%>\"/>", "<div class=\"key\"> Email </div>\n<input type=\"email\" value=\"<%=user.email%>\"/>"],
      actions: ['<div class="btn-save">Save</div>', '<div class="btn-remove text-danger">Remove</div>'],
      h1: "<h1>Hello</h1>",
      indexBody: "<div class=\"tableview\">\n    <%= invoke(tableview, {header:\"Base Info\", cells:userCells}) %>\n    <%= invoke(tableview, {header:\"Actions\", cells:actions}) %>\n</div>"
    });

    return UserDetail;

  })(BaseView);
});
