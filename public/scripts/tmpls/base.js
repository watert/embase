define(["libs/templer"], function(templer) {
  var baseTemplates;
  return baseTemplates = {
    templer: templer,
    navbar: templer({
      left: "",
      right: "Right",
      title: "Navbar",
      index: "<div class=\"navbar\">\n    <div class=\"navbar-inner\">\n        <div class=\"navbar-left\">\n            <%=left%>\n        </div>\n        <div class=\"navbar-title\">\n            <%=title%>\n        </div>\n        <div class=\"navbar-right\">\n            <%=right%>\n        </div>\n    </div>\n</div>"
    })
  };
});
