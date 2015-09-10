require(["app", "jquery"], function(App, $) {
  return $(function() {
    var app;
    window.app = app = new App({
      el: $("body")[0]
    });
    App.instance = app;
    return app;
  });
});
