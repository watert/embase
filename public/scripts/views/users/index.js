var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base"], function(BaseView, baseTmpls) {
  var UserIndexView, Users, navbar, templer, toolbar;
  Users = (function(superClass) {
    extend(Users, superClass);

    function Users() {
      return Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.model = Backbone.Model.extend({
      defaults: {
        email: "",
        name: ""
      }
    });

    Users.prototype.url = "/users/api/restful";

    Users.prototype.parse = function(data) {
      return data.result;
    };

    return Users;

  })(Backbone.Collection);
  navbar = baseTmpls.navbar, toolbar = baseTmpls.toolbar, templer = baseTmpls.templer;
  return UserIndexView = (function(superClass) {
    extend(UserIndexView, superClass);

    function UserIndexView() {
      return UserIndexView.__super__.constructor.apply(this, arguments);
    }

    UserIndexView.prototype.tagName = "div";

    UserIndexView.prototype.events = {
      "click .btn-add": function() {
        return this.navigate("users/detail");
      },
      "click .btn-edit": function() {
        return this.$el.toggleClass("editing");
      },
      "click .users .list-item": function(e) {
        var $check, $item, id;
        console.log("click item", e.currentTarget);
        $item = $(e.currentTarget);
        if (this.$el.hasClass("editing")) {
          $check = $item.find("[type=checkbox]");
          return $check.prop("checked", !$check.prop("checked"));
        } else {
          id = $item.attr("data-id");
          console.log("click", id);
          return this.navigate("users/detail?id=" + id);
        }
      }
    };

    UserIndexView.prototype.render = function(name) {
      var users;
      console.debug("render", this);
      users = new Users;
      return users.fetch().then((function(_this) {
        return function(data) {
          console.log("try render", data);
          _this.setModel({
            users: users.toJSON(),
            query: _this.query
          });
          return UserIndexView.__super__.render.call(_this, name);
        };
      })(this));
    };

    UserIndexView.prototype.template = templer({
      detail: "",
      index: "<%=navbar()%>\n<ul class=\"list\">\n    <li class=\"list-item btn-add\">\n        Add\n    </li>\n</ul>\n<ul class=\"list users\">\n    <%_.each(users, function(item){%>\n        <%=listItem({data:item})%>\n    <%})%>\n</ul>\n<%=toolbar()%>",
      onRender: function() {
        return console.debug("tmpl onRender");
      },
      toolbar: toolbar,
      navbar: navbar.extend({
        title: "Users",
        right: "<div class=\"btn btn-edit\">Edit</div>"
      }),
      listItemBody: templer("<div class=\"item-body\">\n<%=name%> <small> (<%=email%>) </small>\n</div>"),
      listItem: templer("<li class=\"list-item\" data-id=\"<%=data._id%>\">\n    <div class=\"list-check\">\n        <input type=\"checkbox\" name=\"check[<%=data._id%>]\" id=\"\" />\n    </div>\n    <%=listItemBody(data)%>\n    <div class=\"arrow\"> <i class=\"fa fa-angle-right\"></i> </div>\n</li>")
    });

    return UserIndexView;

  })(BaseView);
});
