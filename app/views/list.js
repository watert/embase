var Backbone, List,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Backbone = require("backbone");

List = (function(superClass) {
  var temper;

  extend(List, superClass);

  function List() {
    return List.__super__.constructor.apply(this, arguments);
  }

  temper = require("../libs/temper");

  List.prototype.tagName = "div";

  List.prototype.tmpl = temper({
    listItemBody: "        ",
    listItem: "<li class=\"item\"> Item </li>",
    index: "<ul class=\"list\">\n    <%_.each(data, function(item){%>\n        <%=listItem(item)%>\n    <%})%>\n</ul>"
  });

  return List;

})(Backbone.View);
