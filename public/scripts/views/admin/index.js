var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view"], function(BaseView) {
  var AdminView, BaseAPICollection, BaseAPIModel, DocEditView, Users, baseTmpl, parseData, rpcCall, splitViewTmpl, stores;
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
    users: "/admin/api/users/",
    articles: "/admin/api/articles/",
    files: "/admin/api/files/"
  };
  DocEditView = (function(superClass) {
    extend(DocEditView, superClass);

    function DocEditView() {
      return DocEditView.__super__.constructor.apply(this, arguments);
    }

    DocEditView.prototype.events = {
      "click .confirm-delete": function() {
        return this.doc.destroy().then((function(_this) {
          return function() {
            _this.render("msg", {
              msg: "Document <code>" + _this.doc.id + "</code> deleted"
            });
            return _this.trigger("deleted", _this.doc.id);
          };
        })(this));
      },
      "click .btn-delete": function() {
        this.$(".btn-delete").hide();
        return this.$(".confirm-delete").show();
      }
    };

    DocEditView.prototype.render = function(name) {
      var id, ref, store, storeURL, whenLoadDoc;
      if (name == null) {
        name = "index";
      }
      if (name !== "index") {
        return DocEditView.__super__.render.apply(this, arguments);
      }
      ref = this.options, store = ref.store, id = ref.id;
      this.loadCSS("bower_components/codemirror/lib/codemirror.css");
      if (!(storeURL = stores[store])) {
        return DocEditView.__super__.render.call(this, "error", {
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
          DocEditView.__super__.render.call(_this, "index", {
            store: store,
            id: id,
            query: _this.query
          });
          $editor = _this.$("textarea");
          return whenLoadDoc.then(function(doc) {
            var editor, json;
            _this.doc = doc;
            editor = CM.fromTextArea($editor[0], {
              lineNumbers: true
            });
            json = JSON.stringify(doc.toJSON(), null, "\t");
            return editor.setValue(json);
          }).fail(function() {
            return DocEditView.__super__.render.call(_this, "error", {
              code: -1,
              message: "Document <code>" + id + "</code> not found"
            });
          });
        };
      })(this));
    };

    DocEditView.prototype.template = baseTmpl.extend({
      error: "<div class=\"text-center\">\n    <br />\n    <strong> ERROR </strong>\n    <br />\n    <code> <%=message%> </code>\n</div>",
      index: "<div class=\"editor container\">\n    <h2>Edit Document</h2>\n    <div class=\"doc-info\">\n        <code> doc: <%=store%> / <%=id%> </code>\n        <div class=\"actions\">\n\n        </div>\n    </div>\n    <textarea name=\"\" id=\"\" cols=\"30\" rows=\"10\"></textarea>\n    <div class=\"actions\">\n        <button class=\"btn\">Save</button>\n        <button class=\"btn btn-delete btn-danger\">Delete</button>\n        <button class=\"btn confirm-delete btn-danger hide\">Confirm Delete</button>\n    </div>\n</div>"
    });

    return DocEditView;

  })(BaseView);
  return AdminView = (function(superClass) {
    extend(AdminView, superClass);

    function AdminView() {
      return AdminView.__super__.constructor.apply(this, arguments);
    }

    AdminView.prototype.events = {
      "click .view-detail .btn-query": function(e) {
        var query;
        query = JSON.parse(this.$(".view-detail [name=query]").val() || "{}");
        query = _.extend({}, this.query, {
          query: JSON.stringify(query)
        });
        return this.setQuery(query).render();
      },
      "click .view-detail [data-id]": function(e) {
        var id, query;
        id = $(e.target).closest("[data-id]").data("id");
        query = _.extend({}, this.query, {
          docId: id
        });
        this.setQuery(query);
        return this.render();
      },
      "click .view-master [data-id]": function(e) {
        var id;
        id = $(e.target).closest("[data-id]").data("id");
        this.setQuery({
          store: id
        });
        return this.render();
      }
    };

    AdminView.prototype.renderDocDetail = function(store, id) {
      var detailView;
      detailView = new DocEditView({
        query: this.query,
        store: store,
        id: id
      });
      this.$(".view-detail").empty().append(detailView.el);
      detailView.render();
      return this.once("remove render", function() {
        return detailView.remove();
      });
    };

    AdminView.prototype.renderList = function(store) {
      var ListClass, list, storeURL, where;
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
      where = this.query.query || "{}";
      where = JSON.parse(where);
      return list.fetch({
        data: where
      }).then((function(_this) {
        return function() {
          return _this.renderDetail("jsonList", {
            list: list.toJSON(),
            query: _this.query
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
      this.model = {
        query: this.query
      };
      if (store) {
        this.$(".view-master [data-id=" + store + "]").addClass("active");
        this.showDetail();
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
      detail: "<div class=\"container\">\n\n</div>",
      jsonEditor: "<div class=\"editor container\">\n    <h2>Edit Document</h2>\n    <div class=\"doc-info\">\n        <code> doc: <%=store%> / <%=id%> </code>\n        <div class=\"actions\">\n\n        </div>\n    </div>\n    <textarea name=\"\" id=\"\" cols=\"30\" rows=\"10\"></textarea>\n    <div class=\"actions\">\n        <button class=\"btn\">Save</button>\n        <button class=\"btn btn-delete btn-danger\">Delete</button>\n    </div>\n</div>",
      jsonList: "<div class=\"tableview\">\n    <div class=\"tableview-header\"> Query </div>\n    <div class=\"tableview-cell\">\n        <input type=\"text\" name=\"query\" value=\"<%-query.query%>\"\n            placeholder=\"NeDB Query JSON\"/>\n        <button class=\"btn btn-primary btn-query\"> Query </button>\n    </div>\n    <div class=\"tableview-header\"> Data set </div>\n    <%_.each(list, function(item){ %>\n        <div class=\"list-item tableview-cell\" data-id=\"<%=item._id%>\">\n            <div class=\"body\">\n                <code><%=item._id%></code>\n                <%=JSON.stringify(_.omit(item, \"_id\"))%>\n            </div>\n            <i class=\"fa fa-angle-right\"></i>\n        </div>\n    <% }); %>\n</div>"
    });

    return AdminView;

  })(BaseView.SplitView);
});
