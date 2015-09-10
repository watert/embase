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

    CodesIndexView.prototype.markdown = "<h1> Frontend Cheatsheet</h1>\n\nThings about frontend coding\n---\n## References\n### W3C\n- [CORS: Cross-site HTTP request](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)\n\n### Library Doc\n- [**jQuery** Quick API Reference](http://oscarotero.com/jquery/)\n- [**jQuery 的 Deferred 对象详解 by ruanyifeng](http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html)\n---\n## Responsive Web\n### HTML5 Viewport\n```html\n<meta name=\"viewport\" content=\"width=device-width,\n    user-scalable=no, initial-scale=1.0,\n    maximum-scale=1.0, minimum-scale=1.0\" />\n```\n### CSS3 Media\n```css\n// print version\n@media print {}\n// screen and size\n// comment: iphone 6p width 414px, iphone 6 375px\n@media only screen and (max-width: 414px){}\n@media only screen and (min-width: 421px)\n    and (max-width: 800px){}\n// orientation\n@media only screen and (orientation: portrait){}\n@media only screen and (orientation: landscape){}\n```\n---\n## Flexbox\ntools: [flexbox.less](https://github.com/ProLoser/Flexbox.less), [Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)\n### For the Parent\n```css\ndisplay:flex;\njustify-content: flex-start | flex-end | center |\n    space-between | space-around;\nalign-items: flex-start | flex-end | center |\n    baseline | stretch;\nalign-content: flex-start | flex-end | center |\n    space-between | space-around | stretch;\n\nflex-direction: row | row-reverse |\n    column | column-reverse;\nflex-wrap: nowrap | wrap | wrap-reverse;\nflex-flow: <‘flex-direction’> || <‘flex-wrap’>\n```\n### For the Children\n```css\norder: <integer>;\nflex-grow: <number>; /* default 0 */\nflex-shrink: <number>; /* default 1 */\nflex-basis: <length> | auto; /* default auto */\nflex: none | [ <'flex-grow'> <'flex-shrink'>? ||\n    <'flex-basis'> ]; /* short hand for above */\nalign-self: auto | flex-start | flex-end |\n    center | baseline | stretch;\n\n\n```";

    CodesIndexView.prototype.template = tmpls.extend({
      parse: function(content) {
        var arr, ret;
        arr = content.split("---");
        ret = _.map(arr, function(text) {
          return marked(text);
        });
        console.log(ret);
        return ret;
      },
      index: " <%=invoke(indexBody)%> ",
      indexBody: "<div class=\"cards-title\">\n    <div class=\"title-body\"></div>\n</div>\n<div class=\"cards\">\n    <% _.each(parse(markdown),function(html){ %>\n        <div class=\"card\">\n            <%=html%>\n        </div>\n    <% });%>\n</div>",
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
