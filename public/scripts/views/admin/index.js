var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view"], function(BaseView) {
  var AdminView, BaseAPICollection, Users, baseTmpl, parseData, rpcCall, splitViewTmpl;
  baseTmpl = BaseView.baseTmpl, splitViewTmpl = BaseView.splitViewTmpl;
  parseData = function(data) {
    return data.result || data;
  };
  rpcCall = function(url, data) {
    if (data == null) {
      data = {};
    }
    url = "/user/docs/api/" + method;
    return $.post(url, data).then(function(data) {
      return data.result;
    });
  };
  BaseAPICollection = (function(superClass) {
    extend(BaseAPICollection, superClass);

    function BaseAPICollection() {
      return BaseAPICollection.__super__.constructor.apply(this, arguments);
    }

    BaseAPICollection.prototype.idAttribute = "_id";

    BaseAPICollection.prototype.parse = parseData;

    BaseAPICollection.urlAPI = function(method) {
      return "" + this.prototype.url + method;
    };

    BaseAPICollection.rpc = rpcCall;

    return BaseAPICollection;

  })(Backbone.Collection);
  Users = (function(superClass) {
    extend(Users, superClass);

    function Users() {
      return Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.url = "/users/api/restful/";

    return Users;

  })(BaseAPICollection);
  return AdminView = (function(superClass) {
    extend(AdminView, superClass);

    function AdminView() {
      return AdminView.__super__.constructor.apply(this, arguments);
    }

    AdminView.prototype.render = function() {
      var list;
      AdminView.__super__.render.apply(this, arguments);
      list = new Users();
      return list.fetch().then((function(_this) {
        return function() {
          var data;
          console.log(data = list.toJSON());
          return _this.renderDetail("jsonList", {
            list: data
          });
        };
      })(this));
    };

    AdminView.prototype.template = BaseView.splitViewTmpl.extend({
      navbar: baseTmpl.navbar.extend({
        title: "Admin",
        right: ""
      }),
      cell: "<div class=\"tableview-cell\" data-id=\"id\">\n    <span class=\"body\"><%=title%></span>\n    <i class=\"fa fa-angle-right\"></i>\n</div>",
      master: "<div class=\"container\">\n    <h2>Admin</h2>\n    <div class=\"tableview\">\n        <%=invoke(cell, {id:\"users\", title:\"users\"})%>\n        <%=invoke(cell, {id:\"articles\", title:\"articles\"})%>\n        <%=invoke(cell, {id:\"files\", title:\"files\"})%>\n    </div>\n</div>",
      detail: "<div class=\"container\">\n    Detail\n</div>",
      jsonList: "<div class=\"tableview\">\n    <div class=\"tableview-header\"> Data set </div>\n    <%_.each(list, function(item){ %>\n        <div class=\"tableview-cell\">\n            <div class=\"body\"> <code><%=item._id%></code> <%=item.name||item.title%> </div>\n        </div>\n    <% }); %>\n</div>"
    });

    return AdminView;

  })(BaseView.SplitView);
});
