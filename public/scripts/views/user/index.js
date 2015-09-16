var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base", "libs/util", "models/user"], function(BaseView, baseTmpls, util, User) {
  var UserIndex;
  return UserIndex = (function(superClass) {
    extend(UserIndex, superClass);

    function UserIndex() {
      return UserIndex.__super__.constructor.apply(this, arguments);
    }

    UserIndex.prototype.events = {
      "click .btn-logout": function() {
        return User.call("logout").then((function(_this) {
          return function(data) {
            console.log("logout", data);
            alert("Logout Successfully");
            return _this.render("login");
          };
        })(this));
      },
      "click .btn-login": function() {
        return this.render("login", true);
      },
      "click .btn-register": function() {
        return this.render("register");
      },
      "submit .form": function(e) {
        var $form, action, formData;
        $form = $(e.target).closest("form");
        formData = util.deparamQuery($form.serialize());
        action = $form.data("action");
        console.log("formData", formData);
        return User.call(action, formData).then((function(_this) {
          return function(data) {
            if (action === "register") {
              alert("Register sussessfully.");
              _this.render("login");
            }
            if (action === "login") {
              return _this.render("index");
            }
          };
        })(this));
      }
    };

    UserIndex.prototype.render = function(tmpl, imediately) {
      var user;
      if (imediately == null) {
        imediately = false;
      }
      if (imediately) {
        return UserIndex.__super__.render.call(this, tmpl);
      }
      if (tmpl == null) {
        tmpl = this.query.view || "index";
      }
      if (tmpl === "register") {
        return UserIndex.__super__.render.call(this, tmpl);
      }
      user = new User();
      return user.fetch().then((function(_this) {
        return function(data) {
          console.log(user.toJSON());
          _this.setModel(user);
          return UserIndex.__super__.render.call(_this, tmpl);
        };
      })(this)).fail((function(_this) {
        return function() {
          console.log("try login", tmpl);
          return UserIndex.__super__.render.call(_this, "login");
        };
      })(this));
    };

    UserIndex.prototype.parse = function(data) {
      return data.result;
    };

    UserIndex.prototype.template = baseTmpls.extend({
      index: "<div class=\"profile\">\n    <div class=\"avatar\">\n        <img src=\"http://www.gravatar.com/avatar/<%=emailHash%>?s=200\" alt=\"\" />\n        <h3> <%=name%> </h3>\n    </div>\n    <div class=\"info\">\n        <div class=\"small\"> Email </div>\n        <p><%=email%></p>\n    </div>\n    <div class=\"actions\">\n        <button class=\"btn btn-logout\">Logout</button>\n    </div>\n</div>",
      register: "<form data-action=\"register\" class=\"form form-register\">\n    <h2> User Register </h2>\n    <input type=\"text\" name=\"name\" placeholder=\"Name\"/>\n    <input type=\"email\" name=\"email\" placeholder=\"Email\"/>\n    <input type=\"password\" name=\"password\" placeholder=\"Password\"/>\n    <div class=\"actions\">\n        <button class=\"btn btn-submit\" type=\"submit\">Register</button>\n        <a class=\"btn btn-login btn-link\" href=\"javascript:void(0)\"> Already has account </a>\n    </div>\n</form>",
      login: "<form data-action=\"login\" class=\"form form-login\">\n    <h2> User Login </h2>\n    <input type=\"email\" name=\"email\" placeholder=\"Email\"/>\n    <input type=\"password\" name=\"password\" placeholder=\"Password\"/>\n    <div class=\"actions\">\n        <button class=\"btn btn-submit\" type=\"submit\">Login</button>\n        <button class=\"btn btn-register\" type=\"button\">Register</button>\n    </div>\n</form>"
    });

    return UserIndex;

  })(BaseView);
});
