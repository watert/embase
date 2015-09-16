var Factory,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Factory = function($, Backbone) {
  var ModelView;
  return ModelView = (function(superClass) {
    extend(ModelView, superClass);

    function ModelView(options) {
      var attrs;
      attrs = ["path", "query", "model", "collection", "templateHelpers"];
      _.extend(this, _.pick(options, attrs));
      this.initTemplates();
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

    ModelView.prototype.tagName = "div";

    ModelView.prototype.template = _.template("Empty ModelView");

    ModelView.prototype.show = function() {
      this.trigger("show");
      return typeof this.onShow === "function" ? this.onShow() : void 0;
    };

    ModelView.prototype.render = function(name) {
      var base, base1, data, html, ref, ref1, ref2, ref3, tmpl, tmplRenderer;
      if (name == null) {
        name = "index";
      }
      data = ((ref = this.model) != null ? typeof ref.toJSON === "function" ? ref.toJSON() : void 0 : void 0) || this.model || {};
      if (this.collection) {
        data.collection = (typeof (base = this.collection).toJSON === "function" ? base.toJSON() : void 0) || this.collection;
      }
      data = _.extend(data, this.templateHelpers);
      console.log(this.template, (ref1 = this.template) != null ? ref1[name] : void 0, data);
      tmpl = ((ref2 = this.template) != null ? ref2[name] : void 0) || this.template;
      html = (typeof tmpl === "function" ? tmpl() : void 0) || (typeof (base1 = this.template).invoke === "function" ? base1.invoke(tmpl, data) : void 0) || tmpl;
      this.$el.html(html);
      if (tmplRenderer = (ref3 = this.template._context) != null ? ref3.onRender : void 0) {
        tmplRenderer.bind(this)();
      }
      this.trigger("render");
      if (typeof this.onRender === "function") {
        this.onRender();
      }
      return $.when(this);
    };

    ModelView.prototype.renderError = function(message) {
      var code, msg, res;
      code = null;
      if (res = message.err) {
        code = res.code;
        msg = res.message;
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
  define(["jquery", "backbone"], Factory);
} else {
  window.ModelView = Factory($, Backbone);
}
