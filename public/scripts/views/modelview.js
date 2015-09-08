var Factory,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Factory = function($, Backbone) {
  var ModelView;
  return ModelView = (function(superClass) {
    extend(ModelView, superClass);

    function ModelView(options) {
      var appMethods, attrs;
      attrs = ["path", "query", "model", "collection", "templateHelpers"];
      _.extend(this, _.pick(options, attrs));
      appMethods = ["call", "deparamQuery", "appLinkWithQuery", "getState"];
      _(appMethods).each((function(_this) {
        return function(method) {
          return _this[method] = function() {
            return app[method].apply(app, arguments);
          };
        };
      })(this));
      this.initTemplates();
      if (this.query) {
        this.query = this.deparamQuery(this.query);
      }
      this.renderError = this.renderError.bind(this);
      this.renderLoading = this.renderLoading.bind(this);
      ModelView.__super__.constructor.call(this, options);
      if (this.model) {
        this.setModel(this.model);
      }
      if (this.collection) {
        this.setCollection(this.collection);
      }
    }

    ModelView.prototype.setModel = function(model) {
      if (model != null) {
        if (typeof model.on === "function") {
          model.on("sync", this.render, this);
        }
      }
      return this.model = model;
    };

    ModelView.prototype.setCollection = function(collection) {
      if (collection != null) {
        if (typeof collection.on === "function") {
          collection.on("sync", this.render, this);
        }
      }
      return this.collection = collection;
    };

    ModelView.prototype.initTemplates = function() {
      var invokeTmpl;
      invokeTmpl = function(tmpl) {
        return tmpl;
      };
      this.template = invokeTmpl(this.template);
      return _.each(this.templateHelpers, (function(_this) {
        return function(helper, key) {
          return _this.templateHelpers[key] = invokeTmpl(helper);
        };
      })(this));
    };

    ModelView.prototype.navigateWithQuery = function(link, query) {
      if (-1 === link.indexOf("?")) {
        link += "?";
      } else {
        link += "&";
      }
      link = link + $.param(query);
      return app.router.navigate(link, {
        trigger: true
      });
    };

    ModelView.prototype.navigate = function(link) {
      return app.router.navigate(link, {
        trigger: true
      });
    };

    ModelView.prototype.tagName = "div";

    ModelView.prototype.template = _.template("Empty ModelView");

    ModelView.prototype.show = function() {
      this.trigger("show");
      return typeof this.onShow === "function" ? this.onShow() : void 0;
    };

    ModelView.prototype.render = function() {
      var base, data, html, ref, ref1, tmplRenderer;
      data = ((ref = this.model) != null ? typeof ref.toJSON === "function" ? ref.toJSON() : void 0 : void 0) || this.model || {};
      if (this.collection) {
        data.collection = (typeof (base = this.collection).toJSON === "function" ? base.toJSON() : void 0) || this.collection;
      }
      data = _.extend(data, this.templateHelpers);
      html = (typeof this.template === "function" ? this.template(data) : void 0) || this.template;
      this.$el.html(html);
      if (tmplRenderer = (ref1 = this.template._context) != null ? ref1.onRender : void 0) {
        tmplRenderer.bind(this)();
      }
      this.trigger("render");
      if (typeof this.onRender === "function") {
        this.onRender();
      }
      return $.when();
    };

    ModelView.prototype.renderError = function(message) {
      var code, msg, res;
      code = null;
      if (res = message.base_rsp) {
        code = res.ret;
        msg = res.msg;
      }
      return this.$el.html("<br />\n<div class=\"text-center text-danger\">\n	<h3 class=\"\"> ERROR " + (code || "") + "</h3>\n	<p class=\"\">" + (msg || message) + "</p>\n</div>");
    };

    ModelView.prototype.renderLoading = function(msg) {
      if (msg == null) {
        msg = "Loading...";
      }
      return this.$el.html("<br />\n<p class=\"text-center\"> " + msg + " </p>");
    };

    return ModelView;

  })(Backbone.View);
};

if (window.require && require.defined) {
  define(["jquery", "backbone", "app"], Factory);
} else {
  window.ModelView = Factory($, Backbone, App);
}
