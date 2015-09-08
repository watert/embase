define(["libs/templer"], function(templer) {
  var base;
  return base = {
    templer: templer,
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
  };
});
