var $, App, Backbone, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

$ = require("../node_modules/zepto/zepto.min.js");

_ = require("underscore");

Backbone = require("backbone");

App = (function(superClass) {
  extend(App, superClass);

  function App() {
    console.log("app", _);
  }

  return App;

})(Backbone.View);

module.exports = App;
