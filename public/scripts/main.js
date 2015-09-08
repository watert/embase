require(["app", "jquery"], function(App, $) {
  return $(function() {
    var app;
    console.log($("body"));
    window.app = app = new App({
      el: $("body")[0]
    });
    return console.log('Application is loaded!!');
  });
});
