var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["libs/modelview", "libs/util"], function(ModelView, util) {
  var BaseView;
  return BaseView = (function(superClass) {
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
      return this.on("destroy", function() {
        return $dom.remove();
      });
    };

    BaseView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.query = options.query;
      return BaseView.__super__.initialize.apply(this, arguments);
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

    return BaseView;

  })(ModelView);
});
