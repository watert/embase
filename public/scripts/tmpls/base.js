define(["libs/templer"], function(templer) {
  var base;
  return base = templer({
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
    tableview: templer({
      cells: ["Empty Cell Item"],
      cellItem: "<div class=\"tableview-cell\">\n    <%=invoke(html)%>\n</div>",
      header: "",
      index: "<div class=\"tableview\">\n    <%if(header){ %>\n        <div class=\"tableview-header\">\n        <%=invoke(header)%></div>\n    <% }%>\n    <%_.each(cells, function(cell){\n        print(invoke(cellItem,{html:cell}));\n    })%>\n</div>"
    }),
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
