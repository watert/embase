var slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["views/_base/view", "views/codes/tmpls", "models/base", "codemirror"], function(BaseView, tmpls, BaseModel, CodeMirror) {
  var Collection, Model, MyCodesView, defaultDoc, ref;
  console.log(CodeMirror);
  window.CodeMirror = CodeMirror;
  CodeMirror.loadMode = function() {
    var dfd, modes;
    modes = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    dfd = $.Deferred();
    modes = _.map(modes, function(mode) {
      var url;
      return url = "libs/codemirror/mode/" + mode + "/" + mode;
    });
    console.log("modes", modes);
    require(modes, function() {
      return dfd.resolve();
    });
    return dfd;
  };
  ref = BaseModel.generate({
    url: "/api/usercodes/"
  }), Model = ref.Model, Collection = ref.Collection;
  defaultDoc = {
    _id: null,
    content: "Title\n=====\nBasic Description\n\n---\n\n## First Card\n\nContent"
  };
  return MyCodesView = (function(superClass) {
    extend(MyCodesView, superClass);

    function MyCodesView() {
      return MyCodesView.__super__.constructor.apply(this, arguments);
    }

    MyCodesView.prototype.initialize = function() {
      console.log("initialize");
      this.loadCSS("bower_components/codemirror/lib/codemirror.css");
      return MyCodesView.__super__.initialize.call(this);
    };

    MyCodesView.prototype.events = {
      "submit": function(e) {
        var formData, model;
        e.preventDefault();
        formData = app.util.deparamQuery(this.$("form").serialize());
        formData._id = this.model.id;
        model = new Model(formData);
        model.save().then(function() {
          return console.log(model.toJSON());
        });
        return console.log(formData);
      }
    };

    MyCodesView.prototype.render = function() {
      var query;
      query = app.util.deparamQuery(location.search.slice(1));
      return $.when((function(_this) {
        return function() {
          var doc;
          if (query.id) {
            _this.model = {
              title: "Edit"
            };
            doc = new Model({
              _id: query.id
            });
            return doc.fetch().then(function() {
              return _this.model.doc = doc.toJSON();
            });
          } else {
            return _this.model = {
              title: "Add Content",
              doc: defaultDoc
            };
          }
        };
      })(this)()).then((function(_this) {
        return function() {
          console.log("render", _this.model);
          MyCodesView.__super__.render.apply(_this, arguments);
          return CodeMirror.loadMode("markdown").then(function() {
            return CodeMirror.fromTextArea(_this.$("textarea")[0], {
              mode: "markdown"
            });
          });
        };
      })(this));
    };

    MyCodesView.prototype.template = tmpls.extend({
      editor: "<form action=\"\">\n    <div data-id=\"<%-doc.id%>\">\n        <textarea name=\"content\" cols=\"30\" rows=\"10\"><%=doc.content%></textarea>\n        <div class=\"actions container\">\n            <button class=\"btn btn-save\">Save</button>\n        </div>\n    </div>\n</form>",
      index: "<%=invoke(pageTopbar,{title:title})%>\n<%=invoke(editor,{doc:doc})%>"
    });

    return MyCodesView;

  })(BaseView);
});
