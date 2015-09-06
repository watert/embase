var $, App, _;

console.debug("app.coffeech");

$ = require("../node_modules/zepto/zepto.min.js");

_ = require("underscore");

module.exports = App = (function() {
  function App() {
    console.log("app", _);
  }

  return App;

})();
