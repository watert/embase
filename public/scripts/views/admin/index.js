var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view"], function(BaseView) {
  var AdminView, baseTmpl, splitViewTmpl;
  baseTmpl = BaseView.baseTmpl, splitViewTmpl = BaseView.splitViewTmpl;
  return AdminView = (function(superClass) {
    extend(AdminView, superClass);

    function AdminView() {
      return AdminView.__super__.constructor.apply(this, arguments);
    }

    AdminView.prototype.template = BaseView.splitViewTmpl.extend({
      navbar: baseTmpl.navbar.extend({
        title: "Admin",
        right: ""
      }),
      master: "<div class=\"app\">\n    <h2>Admin</h2>\n\n</div>",
      detail: "Detail View"
    });

    return AdminView;

  })(BaseView.SplitView);
});
