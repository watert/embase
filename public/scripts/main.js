require(["app", "jquery"], function(App, $) {
  return $(function() {
    var app;
    console.log($("body"));
    window.app = app = new App({
      el: $("body")[0]
    });
    App.instance = app;
    console.log('Application is loaded!!');
    return app;
  });
});
