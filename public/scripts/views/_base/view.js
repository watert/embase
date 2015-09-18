var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["libs/modelview", "libs/util", "tmpls/base"], function(ModelView, util, baseTmpl) {
  var BaseView, SplitView, splitViewTmpl;
  BaseView = (function(superClass) {
    extend(BaseView, superClass);

    function BaseView() {
      return BaseView.__super__.constructor.apply(this, arguments);
    }

    BaseView.prototype.loadCSS = function(url) {
      var $dom;
      $dom = $("<link>", {
        href: url,
        rel: "stylesheet"
      }).appendTo($("head"));
      return this.on("remove", function() {
        return $dom.remove();
      });
    };

    BaseView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.query = options.query;
      this.options = options;
      return BaseView.__super__.initialize.apply(this, arguments);
    };

    BaseView.prototype.setQuery = function(query, options) {
      var link, path;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        trigger: false
      });
      path = this.options.path;
      link = path + "?" + $.param(query);
      this.query = query;
      app.router.navigate(link, options);
      return this;
    };

    BaseView.prototype.navigateWithQuery = function(link, query) {
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

    BaseView.prototype.navigate = function(link) {
      return app.router.navigate(link, {
        trigger: true
      });
    };

    BaseView.prototype.template = baseTmpl.extend({
      index: "Base View"
    });

    return BaseView;

  })(ModelView);
  splitViewTmpl = baseTmpl.extend({
    detail: "Empty",
    master: "",
    index: "<div class=\"view-master\">\n	<div class=\"body\"><%=invoke(master)%></div>\n</div>\n<div class=\"view-detail\">\n	<div class=\"body\"></div>\n</div>"
  });
  SplitView = (function(superClass) {
    extend(SplitView, superClass);

    function SplitView() {
      return SplitView.__super__.constructor.apply(this, arguments);
    }

    SplitView.prototype.className = "splitview";

    SplitView.prototype.initialize = function(options) {
      return SplitView.__super__.initialize.apply(this, arguments);
    };

    SplitView.prototype.render = function() {
      SplitView.__super__.render.apply(this, arguments);
      return this.renderDetail();
    };

    SplitView.prototype.showDetail = function() {
      return this.$el.addClass("show-detail");
    };

    SplitView.prototype.renderDetail = function(tmplName, data) {
      var tmpl;
      if (tmplName == null) {
        tmplName = "detail";
      }
      if (data == null) {
        data = {};
      }
      tmpl = this.template.invoke(this.template[tmplName], data);
      return this.$(".view-detail .body:eq(0)").empty().append(tmpl);
    };

    SplitView.prototype.template = splitViewTmpl;

    return SplitView;

  })(BaseView);
  _.extend(BaseView, {
    SplitView: SplitView,
    baseTmpl: baseTmpl,
    splitViewTmpl: splitViewTmpl
  });
  return BaseView;
});
