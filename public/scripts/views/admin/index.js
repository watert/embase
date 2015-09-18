var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view"], function(BaseView) {
  var AdminView, BaseAPICollection, BaseAPIModel, Users, baseTmpl, parseData, rpcCall, splitViewTmpl, stores;
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
  BaseAPIModel = (function(superClass) {
    extend(BaseAPIModel, superClass);

    function BaseAPIModel() {
      return BaseAPIModel.__super__.constructor.apply(this, arguments);
    }

    BaseAPIModel.prototype.parse = parseData;

    BaseAPIModel.prototype.idAttribute = "_id";

    return BaseAPIModel;

  })(Backbone.Model);
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
  stores = {
    users: "/users/api/restful/",
    articles: "/admin/api/articles/",
    files: "/admin/api/files/"
  };
  return AdminView = (function(superClass) {
    extend(AdminView, superClass);

    function AdminView() {
      return AdminView.__super__.constructor.apply(this, arguments);
    }

    AdminView.prototype.events = {
      "click .view-detail [data-id]": function(e) {
        var id, query;
        id = $(e.target).closest("[data-id]").data("id");
        query = _.extend({}, this.query, {
          docId: id
        });
        return this.setQuery(query, {
          trigger: true
        });
      },
      "click .view-master [data-id]": function(e) {
        var id;
        id = $(e.target).closest("[data-id]").data("id");
        return this.setQuery({
          store: id
        }, {
          trigger: true
        });
      }
    };

    AdminView.prototype.renderDocDetail = function(store, id) {
      var storeURL, whenLoadDoc;
      this.loadCSS("bower_components/codemirror/lib/codemirror.css");
      if (!(storeURL = stores[store])) {
        return this.renderDetail("detailError", {
          code: -1,
          message: "Can't find store"
        });
      }
      whenLoadDoc = (function() {
        var ModelClass, doc;
        ModelClass = (function(superClass1) {
          extend(ModelClass, superClass1);

          function ModelClass() {
            return ModelClass.__super__.constructor.apply(this, arguments);
          }

          ModelClass.prototype.urlRoot = storeURL;

          return ModelClass;

        })(BaseAPIModel);
        return (doc = new ModelClass({
          _id: id
        })).fetch().then(function() {
          return doc;
        });
      })();
      return require(["codemirror"], (function(_this) {
        return function(CM) {
          var $editor;
          _this.renderDetail("jsonEditor", {
            store: store,
            id: id
          });
          $editor = _this.$(".view-detail textarea");
          return whenLoadDoc.then(function(doc) {
            var editor, json;
            editor = CM.fromTextArea($editor[0], {
              lineNumbers: true
            });
            json = JSON.stringify(doc.toJSON(), null, "\t");
            return editor.setValue(json);
          });
        };
      })(this));
    };

    AdminView.prototype.renderList = function(store) {
      var ListClass, list, storeURL;
      if (!(storeURL = stores[store])) {
        return this.renderDetail("detailError", {
          code: -1,
          message: "Can't find store"
        });
      }
      ListClass = (function(superClass1) {
        extend(ListClass, superClass1);

        function ListClass() {
          return ListClass.__super__.constructor.apply(this, arguments);
        }

        ListClass.prototype.url = storeURL;

        return ListClass;

      })(BaseAPICollection);
      list = new ListClass();
      return list.fetch().then((function(_this) {
        return function() {
          return _this.renderDetail("jsonList", {
            list: list.toJSON()
          });
        };
      })(this)).fail((function(_this) {
        return function(err) {
          return _this.renderDetail("detailError", {
            code: -1,
            message: "List Fetch Error"
          });
        };
      })(this));
    };

    AdminView.prototype.render = function() {
      var docId, ref, store;
      AdminView.__super__.render.apply(this, arguments);
      ref = this.query != null ? this.query : this.query = {}, store = ref.store, docId = ref.docId;
      if (store) {
        this.$(".view-master [data-id=" + store + "]").addClass("active");
      }
      if (store && docId) {
        return this.renderDocDetail(store, docId);
      } else if (store) {
        return this.renderList(store);
      }
    };

    AdminView.prototype.template = BaseView.splitViewTmpl.extend({
      navbar: baseTmpl.navbar.extend({
        title: "Admin",
        right: ""
      }),
      cell: "<div class=\"tableview-cell\" data-id=\"<%=id%>\">\n    <span class=\"body\"><%=title%></span>\n    <i class=\"fa fa-angle-right\"></i>\n</div>",
      master: "<div class=\"container\">\n    <h2>Admin</h2>\n    <div class=\"tableview\">\n        <%=invoke(cell, {id:\"users\", title:\"users\"})%>\n        <%=invoke(cell, {id:\"articles\", title:\"articles\"})%>\n        <%=invoke(cell, {id:\"files\", title:\"files\"})%>\n    </div>\n</div>",
      detailError: "<div class=\"text-center\">\n<br />\n<code> <%=code%> <%=message%> </code>\n</div>",
      detail: "<div class=\"container\">\n    Detail\n</div>",
      jsonEditor: "<div class=\"editor container\">\n    <h2>Edit Document</h2>\n    <div class=\"doc-info\">\n        <code> doc: <%=store%> / <%=id%> </code>\n        <div class=\"actions\">\n\n        </div>\n    </div>\n    <textarea name=\"\" id=\"\" cols=\"30\" rows=\"10\"></textarea>\n    <div class=\"actions\">\n        <button class=\"btn\">Save</button>\n        <button class=\"btn btn-danger\">Delete</button>\n    </div>\n</div>",
      jsonList: "<div class=\"tableview\">\n    <div class=\"tableview-header\"> Query </div>\n    <div class=\"tableview-cell\">\n        <input type=\"text\" placeholder=\"NeDB Query JSON\"/>\n        <button class=\"btn btn-primary\"> Query </button>\n    </div>\n    <div class=\"tableview-header\"> Data set </div>\n    <%_.each(list, function(item){ %>\n        <div class=\"list-item tableview-cell\" data-id=\"<%=item._id%>\">\n            <div class=\"body\"> <code><%=item._id%></code> <%=item.name||item.title%> </div>\n            <i class=\"fa fa-angle-right\"></i>\n        </div>\n    <% }); %>\n</div>"
    });

    return AdminView;

  })(BaseView.SplitView);
});
