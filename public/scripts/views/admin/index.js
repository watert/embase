var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "marked"], function(BaseView, marked) {
  var AdminView, BaseAPICollection, BaseAPIModel, DocEditView, Users, baseTmpl, navbarBack, parseData, rpcCall, splitViewTmpl, stores;
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
  navbarBack = baseTmpl.navbar.extend({
    backTitle: "Back",
    left: baseTmpl.templer("<div class=\"btn-back\">\n    <i class=\"fa fa-angle-left\"></i>\n    <%=backTitle%></div>")
  });
  DocEditView = (function(superClass) {
    extend(DocEditView, superClass);

    function DocEditView() {
      return DocEditView.__super__.constructor.apply(this, arguments);
    }

    DocEditView.prototype.events = {
      "click .btn-back": function() {
        return history.back();
      },
      "click .btn-save": function() {
        var $btn, err, val;
        $btn = this.$(".btn-save").css({
          opacity: .5,
          transition: "all .5s"
        }).attr("disabled", true);
        try {
          val = JSON.parse(this.editor.getValue());
          return this.doc.save(val).then((function(_this) {
            return function() {
              var id, query;
              $btn.css({
                opacity: 1
              }).attr("disabled", false);
              if (id = _this.doc.id && !_this.options.id) {
                query = _.extend({
                  docId: _this.doc.id
                }, {
                  store: _this.options.store
                });
                _this.setQuery(query);
                return _this.updateEditor();
              }
            };
          })(this));
        } catch (_error) {
          err = _error;
          return alert("JSON parse err" + err);
        }
      },
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

    DocEditView.prototype.updateEditor = function() {
      return require(["codemirror"], (function(_this) {
        return function(CM) {
          var $editor, json;
          if (!_this.editor) {
            $editor = _this.$("textarea");
            _this.editor = CM.fromTextArea($editor[0], {
              lineNumbers: true
            });
          }
          json = JSON.stringify(_this.doc.toJSON(), null, "\t");
          return _this.editor.setValue(json);
        };
      })(this));
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
        if (id) {
          return (doc = new ModelClass({
            _id: id
          })).fetch().then(function() {
            return doc;
          });
        } else {
          return $.when(new ModelClass({
            _id: id
          }));
        }
      })();
      DocEditView.__super__.render.call(this, "index", {
        store: store,
        id: id,
        query: this.query
      });
      return whenLoadDoc.then((function(_this) {
        return function(doc) {
          _this.doc = doc;
          return _this.updateEditor();
        };
      })(this)).fail((function(_this) {
        return function() {
          return DocEditView.__super__.render.call(_this, "error", {
            code: -1,
            message: "Document <code>" + id + "</code> not found"
          });
        };
      })(this));
    };

    DocEditView.prototype.template = baseTmpl.extend({
      navbarBack: navbarBack,
      edgeNavbarBack: "<div class=\"edge when-mobile\">\n    <%=navbarBack({backTitle:backTitle})%>\n</div>",
      error: "<%=invoke(edgeNavbarBack, {backTitle:\"List\"})%>\n<div class=\"text-center\">\n    <br /> <strong> ERROR </strong>\n    <br /> <code> <%=message%> </code>\n</div>",
      index: " <div class=\"editor container\">\n    <%=invoke(edgeNavbarBack, {backTitle:\"List\"})%>\n    <h2>Edit Document</h2>\n    <div class=\"doc-info\">\n        <code> doc: <%=store%> / <%=id%> </code>\n        <div class=\"actions\">\n\n        </div>\n    </div>\n    <textarea name=\"\" id=\"\" cols=\"30\" rows=\"10\"></textarea>\n    <div class=\"actions\">\n        <button class=\"btn btn-save\">Save</button>\n        <button class=\"btn btn-delete btn-danger\">Delete</button>\n        <button class=\"btn confirm-delete btn-danger hide\">Confirm Delete</button>\n    </div>\n</div>"
    });

    return DocEditView;

  })(BaseView);
  return AdminView = (function(superClass) {
    extend(AdminView, superClass);

    function AdminView() {
      return AdminView.__super__.constructor.apply(this, arguments);
    }

    AdminView.prototype.events = {
      "click .cell-status": function() {
        return this.renderStatus();
      },
      "click .btn-add-record": function() {
        return this.renderDocDetail(this.query.store);
      },
      "click .btn-back": function() {
        this.hideDetail();
        return this.setQuery({}).render();
      },
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

    AdminView.prototype.renderStatus = function() {
      this.$(".view-master .cell-status").addClass("active").siblings().removeClass("active");
      return $.post("/admin/api/status/").then((function(_this) {
        return function(data) {
          var $markdown, text;
          console.log(data.result);
          _this.renderDetail("dbstatus", data);
          $markdown = _this.$(".view-detail .markdown");
          text = $markdown.text();
          return $markdown.html(marked.parse(text));
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
      } else {
        return this.renderStatus();
      }
    };

    AdminView.prototype.template = BaseView.splitViewTmpl.extend({
      navbar: baseTmpl.navbar.extend({
        title: "Admin",
        right: ""
      }),
      cell: "<div class=\"tableview-cell\" data-id=\"<%=id%>\">\n    <span class=\"body\"><%=title%></span>\n    <i class=\"fa fa-angle-right\"></i>\n</div>",
      dbstatus: "<div class=\"container\">\n<h2>Status:</h2>\n<div class=\"markdown\">\n|name|size|\n|----|----|<% _.each(result, function(row){ %>\n|<%-row.name%>|<%-(row.size/1000).toFixed(2)%>K| <%}) %>\n</pre>\n</div>\n</div>",
      navbarBack: navbarBack,
      master: "<div class=\"container\">\n    <h2>Admin</h2>\n    <div class=\"tableview\">\n        <div class=\"tableview-cell cell-status\">\n            <span>Status</span><i class=\"fa fa-angle-right\"></i>\n        </div>\n        <div class=\"tableview-header\">Tables</div>\n        <%=invoke(cell, {id:\"users\", title:\"users\"})%>\n        <%=invoke(cell, {id:\"articles\", title:\"articles\"})%>\n        <%=invoke(cell, {id:\"files\", title:\"files\"})%>\n    </div>\n</div>",
      detailError: "<div class=\"text-center\">\n<br />\n<code> <%=code%> <%=message%> </code>\n</div>",
      detail: "<div class=\"container\">\n\n</div>",
      jsonList: "<div class=\"edge when-mobile\">\n    <%=navbarBack({backTitle:\"Admin\"})%>\n</div>\n<div class=\"tableview\">\n    <div class=\"tableview-header \">\n        <span>Query</span>\n    </div>\n    <div class=\"tableview-cell\">\n        <input type=\"text\" name=\"query\" value=\"<%-query.query%>\"\n            placeholder=\"NeDB Query JSON\"/>\n        <button class=\"btn btn-primary btn-query\"> Query </button>\n    </div>\n    <div class=\"tableview-header flex-row\">\n        <span>Data set</span>\n\n        <span class=\"btn btn-link btn-add-record\">\n            <i class=\"fa fa-plus\"></i> Add\n        </span>\n    </div>\n    <%_.each(list, function(item){ %>\n        <div class=\"list-item tableview-cell\" data-id=\"<%=item._id%>\">\n            <div class=\"body\">\n                <code><%=item._id%></code>\n                <%=JSON.stringify(_.omit(item, \"_id\"))%>\n            </div>\n            <i class=\"fa fa-angle-right\"></i>\n        </div>\n    <% }); %>\n</div>"
    });

    return AdminView;

  })(BaseView.SplitView);
});
