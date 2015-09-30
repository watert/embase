var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "views/codes/tmpls", "models/base", "marked"], function(BaseView, tmpls, BaseModel, marked) {
  var Collection, Model, MyCodesView, ref;
  console.log(BaseModel);
  ref = BaseModel.generate({
    url: "/api/usercodes/"
  }), Model = ref.Model, Collection = ref.Collection;
  return MyCodesView = (function(superClass) {
    extend(MyCodesView, superClass);

    function MyCodesView() {
      return MyCodesView.__super__.constructor.apply(this, arguments);
    }

    MyCodesView.prototype.initialize = function() {
      var loginUrl, redirect, ref1;
      if (!((ref1 = DATA.user) != null ? ref1._id : void 0)) {
        redirect = encodeURIComponent(location.href);
        loginUrl = "usercenter/?redirect=" + redirect;
        return location.href = loginUrl;
      }
    };

    MyCodesView.prototype.model = {};

    MyCodesView.prototype.render = function() {
      this.collection = new Collection;
      return this.collection.fetch().then((function(_this) {
        return function() {
          var list;
          list = _this.collection.toJSON();
          console.log(_this.collection);
          _.each(list, function(row) {
            row.link = "codes/?id=" + row._id;
            return row.digest = marked.parse(row.content.split("---")[0]).replace(/h1/g, "h2");
          });
          _this.model.list = list;
          return MyCodesView.__super__.render.apply(_this, arguments);
        };
      })(this));
    };

    MyCodesView.prototype.events = {
      "click [data-href]": function(e) {
        var href;
        href = $(e.currentTarget).data("href");
        return app.router.navigate(href, {
          trigger: true
        });
      },
      "click .btn-edit": function(e) {
        var $row, id, url;
        $row = $(e.target).closest(".row");
        id = $row.data("id");
        url = "codes/edit/?id=" + id;
        return app.router.navigate(url, {
          trigger: true
        });
      },
      "click .btn-delete": function(e) {
        var $row, model;
        if (!confirm("sure to delete?")) {
          return;
        }
        $row = $(e.target).closest(".row");
        model = this.collection.findWhere({
          _id: $row.data("id")
        });
        return model.destroy().then(function() {
          return $row.fadeOut(300, function() {
            return $row.remove();
          });
        });
      },
      "click .btn-add": function() {
        return app.router.navigate("codes/edit", {
          trigger: true
        });
      }
    };

    MyCodesView.prototype.template = tmpls.extend({
      codeRow: "<div class=\"row\" data-id=\"<%-row._id%>\">\n    <div class=\"digest\" data-href=\"<%-row.link%>\">\n        <%=row.digest %>\n    </div>\n    <div class=\"actions\">\n        <a data-href=\"<%-row.link%>\" class=\"btn-link btn-view\"> <i class=\"fa fa-eye\"></i>View </a>\n        <span class=\"btn-link btn-edit\"> <i class=\"fa fa-edit\"></i>Edit </span>\n        <span class=\"btn-link btn-delete\"> <i class=\"fa fa-trash\"></i>Delete </span>\n    </div>\n</div>",
      index: "<%=invoke(pageTopbar, {title:\"My Codes\"})%>\n<div class=\"codes\">\n    <% _.each(list, function(row){ %>\n        <%=invoke(codeRow, {row:row})%>\n    <% })%>\n</div>"
    });

    return MyCodesView;

  })(BaseView);
});
