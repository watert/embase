define(["libs/templer"], function(templer) {
  var base;
  return base = templer({
    events: {
      extend: function(ctx) {
        return console.log("extend", ctx);
      }
    },
    templer: templer,
    invoke: function(method, data) {
      var tmpl;
      tmpl = method;
      if (_.isString(method)) {
        tmpl = templer(method);
      }
      data = _.extend({}, this, data);
      return tmpl.bind(this)(data);
    },
    index: " <%=navbar()+invoke(indexBody)+toolbar()%> ",
    indexBody: "Hello World",
    toolbar: templer({
      items: ["Delete", "Mark"],
      itemTmpl: templer("<div class=\"toolbar-item\">\n    <div class=\"btn\"><%=name%></div>\n</div>"),
      index: "<div class=\"toolbar\">\n    <div class=\"toolbar-inner\">\n    <% _.each(items, function(item){ %>\n        <%=itemTmpl({name:item})%>\n    <% });%>\n    </div>\n</div>"
    }),
    navbar: templer({
      left: "",
      right: "Right",
      title: "Navbar",
      index: "<div class=\"navbar\">\n    <div class=\"navbar-inner\">\n        <div class=\"navbar-left\">\n            <%=left%>\n        </div>\n        <div class=\"navbar-title\">\n            <%=title%>\n        </div>\n        <div class=\"navbar-right\">\n            <%=right%>\n        </div>\n    </div>\n</div>"
    })
  });
});
