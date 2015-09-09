var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/baseview", "tmpls/base"], function(BaseView, baseTmpls) {
  var List, navbar, templer, toolbar;
  navbar = baseTmpls.navbar, toolbar = baseTmpls.toolbar, templer = baseTmpls.templer;
  return List = (function(superClass) {
    extend(List, superClass);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.tagName = "div";

    List.prototype.events = {
      "click .btn-edit": function() {
        return this.$el.toggleClass("editing");
      },
      "click .list-item": function(e) {
        var $check, $item, id;
        console.log("click item", e.currentTarget);
        $item = $(e.currentTarget);
        if (this.$el.hasClass("editing")) {
          $check = $item.find("[type=checkbox]");
          return $check.prop("checked", !$check.prop("checked"));
        } else {
          id = $item.attr("data-id");
          console.log("click", id);
          return this.navigate("users/?id=" + id);
        }
      }
    };

    List.prototype.render = function() {
      console.debug("render", this);
      return $.get("/users/api/find").then((function(_this) {
        return function(data) {
          _this.setModel({
            users: data,
            query: _this.query
          });
          return List.__super__.render.call(_this);
        };
      })(this));
    };

    List.prototype.template = templer({
      detail: "                ",
      index: "<%=navbar()%>\n<% if(query.id) {%>\n    with id\n<%}else {%>\n    <ul class=\"list\">\n        <%_.each(users, function(item){%>\n            <%=listItem({data:item})%>\n        <%})%>\n    </ul>\n<%}%>\n<%=toolbar()%>",
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

    return List;

  })(BaseView);
});
