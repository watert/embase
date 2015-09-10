var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base"], function(BaseView, tmpls) {
  var CodesIndexView;
  return CodesIndexView = (function(superClass) {
    extend(CodesIndexView, superClass);

    function CodesIndexView() {
      return CodesIndexView.__super__.constructor.apply(this, arguments);
    }

    CodesIndexView.prototype.template = tmpls.extend({
      indexBody: 'codes'
    });

    return CodesIndexView;

  })(BaseView);
});
