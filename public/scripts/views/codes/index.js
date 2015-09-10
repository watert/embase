var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base", "highlightjs"], function(BaseView, tmpls) {
  var CodesIndexView;
  console.log("hljs", hljs);
  return CodesIndexView = (function(superClass) {
    extend(CodesIndexView, superClass);

    function CodesIndexView() {
      return CodesIndexView.__super__.constructor.apply(this, arguments);
    }

    CodesIndexView.prototype.initialize = function() {
      return this.loadCSS("../bower_components/highlightjs/styles/default.css");
    };

    CodesIndexView.prototype.template = tmpls.extend({
      indexBody: "<pre><code class=\"javascript\">\nvar a = 123;\n</code></pre>"
    });

    CodesIndexView.prototype.render = function() {
      CodesIndexView.__super__.render.call(this);
      return this.$("code").each(function() {
        return hljs.highlightBlock(this);
      });
    };

    return CodesIndexView;

  })(BaseView);
});
