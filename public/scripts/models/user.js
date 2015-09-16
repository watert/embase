var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["backbone", "jquery"], function() {
  var User, UserDocs;
  UserDocs = (function(superClass) {
    var UserDocModel;

    extend(UserDocs, superClass);

    function UserDocs() {
      return UserDocs.__super__.constructor.apply(this, arguments);
    }

    UserDocs.storeName = "article";

    UserDocs.prototype.idAttribute = "_id";

    UserDocs.prototype.url = function() {
      return "/user/docs/" + (this.storeName || this.constructor.storeName) + "/";
    };

    UserDocs.prototype.model = UserDocModel = (function(superClass1) {
      extend(UserDocModel, superClass1);

      function UserDocModel() {
        return UserDocModel.__super__.constructor.apply(this, arguments);
      }

      UserDocModel.prototype.idAttribute = "_id";

      UserDocModel.prototype.parse = function(data) {
        return data.result || data;
      };

      return UserDocModel;

    })(Backbone.Model);

    UserDocs.prototype.parse = function(data) {
      return data.result || data;
    };

    UserDocs.create = function(data) {
      var docs;
      (docs = new this).add(data);
      return docs.at(0);
    };

    return UserDocs;

  })(Backbone.Collection);
  User = (function(superClass) {
    extend(User, superClass);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.idAttribute = "_id";

    User.prototype.urlRoot = "/user/api/";

    User.get = function() {
      var user;
      return (user = new User).fetch().then(function() {
        return user;
      });
    };

    User.urlApi = function(method) {
      return "" + this.prototype.urlRoot + method;
    };

    User.call = function(method, data) {
      var url;
      if (data == null) {
        data = {};
      }
      url = this.urlApi(method);
      return $.post(url, data).then(function(data) {
        return new User(data.result);
      });
    };

    User.prototype.parse = function(data) {
      return data.result;
    };

    return User;

  })(Backbone.Model);
  _.extend(User, {
    UserDocs: UserDocs
  });
  return User;
});
