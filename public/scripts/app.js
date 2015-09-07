var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["jquery", "backbone", "libs/action-dispatcher", "libs/templer"], function($, Backbone, Dispatcher, templer) {
  var App, Router;
  Router = (function(superClass) {
    extend(Router, superClass);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "*path": function(path) {
        return this.trigger("route-path", path);
      }
    };

    return Router;

  })(Backbone.Router);
  return App = (function(superClass) {
    extend(App, superClass);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.initialize = function() {
      this.router = new Router;
      this.router.on("route-path", this.loadViewPath.bind(this));
      _.extend(this, new Dispatcher);
      this.render();
      return Backbone.history.start({
        pushState: true,
        root: "/"
      });
    };

    App.prototype.render = function() {
      console.log("app render");
      console.log(this.$el);
      return this.$el.html(this.tmpl());
    };

    App.prototype.tmpl = templer("<div class=\"app\">\n    <div class=\"app-body\">\n    </div>\n</div>");

    App.prototype.loadViewPath = function(path) {
      var dfd;
      dfd = $.Deferred();
      if (path.slice(-1) === "/") {
        path = path.slice(0, -1);
      }
      require(["views/" + path], (function(_this) {
        return function(View) {
          var $body, view;
          $body = _this.$(".app-body").empty();
          _this.view = view = new View({
            el: $body[0]
          });
          return view.render();
        };
      })(this));
      return dfd;
    };

    return App;

  })(Backbone.View);
});
