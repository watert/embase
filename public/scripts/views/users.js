var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/modelview", "tmpls/base"], function(ModelView, baseTmpls) {
  var List, navbar, templer;
  navbar = baseTmpls.navbar, templer = baseTmpls.templer;
  return List = (function(superClass) {
    extend(List, superClass);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.tagName = "div";

    List.prototype.events = {
      "click .btn-edit": function() {
        return this.$(".list").toggleClass("editing");
      },
      "click .editing .list-item": function(e) {
        var $item;
        $item = $(e.currentTarget);
        return $item.find("[type=checkbox]").click();
      }
    };

    List.prototype.render = function() {
      return $.get("/users/api/find").then((function(_this) {
        return function(data) {
          _this.setModel({
            users: data
          });
          console.log(_this.template.context.onRender);
          return List.__super__.render.call(_this);
        };
      })(this));
    };

    List.prototype.template = templer({
      index: "<%=navbar()%>\n<ul class=\"list\">\n    <%_.each(users, function(item){%>\n        <%=listItem({data:item})%>\n    <%})%>\n</ul>",
      onRender: function() {},
      navbar: navbar.extend({
        title: "Users",
        right: "<div class=\"btn btn-edit\">Edit</div>"
      }),
      listItemBody: templer("<div class=\"item-body\" data-id=\"<%=_id%>\">\n<%=name%> <small> (<%=email%>) </small>\n</div>"),
      listItem: templer("<li class=\"list-item\">\n    <div class=\"list-check\">\n        <input type=\"checkbox\" name=\"check[<%=data._id%>]\" id=\"\" />\n    </div>\n    <%=listItemBody(data)%>\n    <div class=\"arrow\"> <i class=\"fa fa-angle-right\"></i> </div>\n</li>")
    });

    return List;

  })(ModelView);
});
