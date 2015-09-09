var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/baseview", "tmpls/base"], function(BaseView, baseTmpls) {
  var UserDetail;
  return UserDetail = (function(superClass) {
    extend(UserDetail, superClass);

    function UserDetail() {
      return UserDetail.__super__.constructor.apply(this, arguments);
    }

    return UserDetail;

  })(BaseView);
});
