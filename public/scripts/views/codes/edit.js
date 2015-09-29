var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "views/codes/tmpls"], function(BaseView, tmpls) {
  var MyCodesView;
  return MyCodesView = (function(superClass) {
    extend(MyCodesView, superClass);

    function MyCodesView() {
      return MyCodesView.__super__.constructor.apply(this, arguments);
    }

    MyCodesView.prototype.events = {
      "click .btn-add": function() {
        return app.router.navigate("codes/edit", {
          trigger: true
        });
      }
    };

    MyCodesView.prototype.template = tmpls.extend({
      index: "<%=invoke(pageTopbar,{title:\"Edit\"})%>"
    });

    return MyCodesView;

  })(BaseView);
});
