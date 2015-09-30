var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "models/base", "tmpls/base", "marked", "highlightjs"], function(BaseView, BaseModel, tmpls, marked) {
  var CodesIndexView, Collection, Model, ref;
  ref = BaseModel.generate({
    url: "/api/usercodes/"
  }), Model = ref.Model, Collection = ref.Collection;
  console.log("hljs", hljs);
  return CodesIndexView = (function(superClass) {
    extend(CodesIndexView, superClass);

    function CodesIndexView() {
      return CodesIndexView.__super__.constructor.apply(this, arguments);
    }

    CodesIndexView.prototype.initialize = function() {
      CodesIndexView.__super__.initialize.call(this);
      return this.loadCSS("../bower_components/highlightjs/styles/default.css");
    };

    CodesIndexView.prototype.events = {
      "click .btn-expand-all": function(e) {
        return this.$(".needs-readmore .btn-readmore").click();
      },
      "click .btn-readmore": function(e) {
        return $(e.target).closest(".card").addClass("expand");
      }
    };

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
      indexBody: "<div class=\"cards-title\">\n    <div class=\"topbar\">\n        <a href=\"codes/my/\">My Codes</a>\n        <a href=\"codes/\">Explore</a>\n    </div>\n    <div class=\"title-body\"></div>\n    <div class=\"actions\">\n        <div class=\"btn-expand-all\"> Expand all <i class=\"fa fa-angle-down\"></i> </div>\n    </div>\n</div>\n<div class=\"cards\">\n    <% _.each(parse(content),function(html){ %>\n        <div class=\"card\">\n            <div class=\"content\"><%=html%></div>\n            <div class=\"btn-readmore\"> Readmore </div>\n        </div>\n    <% });%>\n</div>",
      marked: marked
    });

    CodesIndexView.prototype.render = function() {
      var query;
      query = app.util.deparamQuery(location.search.slice(1));
      if (query.id) {
        this.model = new Model({
          _id: query.id
        });
        return this.model.fetch().then((function(_this) {
          return function() {
            CodesIndexView.__super__.render.call(_this);
            return _this.renderContent();
          };
        })(this));
      } else {
        if (this.model == null) {
          this.model = {
            content: "Not found\n======="
          };
        }
        CodesIndexView.__super__.render.call(this);
        return this.renderContent();
      }
    };

    CodesIndexView.prototype.renderContent = function() {
      var $title;
      this.$("code").each(function() {
        return hljs.highlightBlock(this);
      });
      $title = this.$(".card").first().appendTo(this.$(".cards-title .title-body"));
      $title.removeClass("card").find(".btn-readmore").remove();
      return this.renderCards();
    };

    CodesIndexView.prototype.renderCards = function() {
      return this.$(".card").each(function(i) {
        var $card, $last, lastPosBottom;
        $card = $(this);
        console.log(i, $card.html());
        $last = $card.children(".content");
        lastPosBottom = $last.height() + $last.position().top - $card.position().top;
        if (lastPosBottom > $card.height() && $card.height() > 200) {
          return $card.addClass("needs-readmore");
        }
      });
    };

    return CodesIndexView;

  })(BaseView);
});
