var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "tmpls/base", "marked", "highlightjs"], function(BaseView, tmpls, marked) {
  var CodesIndexView;
  console.log("hljs", hljs);
  return CodesIndexView = (function(superClass) {
    extend(CodesIndexView, superClass);

    function CodesIndexView() {
      return CodesIndexView.__super__.constructor.apply(this, arguments);
    }

    CodesIndexView.prototype.initialize = function() {
      CodesIndexView.__super__.initialize.call(this);
      this.loadCSS("../bower_components/highlightjs/styles/default.css");
      this.setModel({
        markdown: this.markdown
      });
      return console.log("init", this.model);
    };

    CodesIndexView.prototype.markdown = "<h1> Frontend Cheatsheet</h1>\n\nThings about frontend coding\n---\n### HTML5 Viewport\n```html\n<meta name=\"viewport\" content=\"width=device-width,\n    user-scalable=no, initial-scale=1.0,\n    maximum-scale=1.0, minimum-scale=1.0\" />\n```\n---\n### CSS3 Media\n```css\n// print version\n@media print {}\n// screen and size\n// comment: iphone 6p width 414px, iphone 6 375px\n@media only screen and (max-width: 414px){}\n@media only screen and (min-width: 421px)\n    and (max-width: 800px){}\n// orientation\n@media only screen and (orientation: portrait){}\n@media only screen and (orientation: landscape){}\n```";

    CodesIndexView.prototype.template = tmpls.extend({
      parse: function(content) {
        var arr;
        arr = content.split("---");
        return _.map(arr, function(text) {
          return marked(text);
        });
      },
      index: " <%=invoke(indexBody)%> ",
      indexBody: "<div class=\"cards-title\">\n    <div class=\"title-body\"></div>\n</div>\n<div class=\"cards\">\n    <% _.each(parse(markdown),(html)=>{ %>\n        <div class=\"card\">\n            <%=html%>\n        </div>\n    <% });%>\n</div>",
      marked: marked
    });

    CodesIndexView.prototype.render = function() {
      CodesIndexView.__super__.render.call(this);
      this.$("code").each(function() {
        return hljs.highlightBlock(this);
      });
      return this.$(".card").first().appendTo(this.$(".cards-title .title-body")).removeClass("card");
    };

    return CodesIndexView;

  })(BaseView);
});
