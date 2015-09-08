var BaseDoc, DBStore, UserDoc, _, _hasKeys, crypto, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require("./db"), BaseDoc = ref.BaseDoc, DBStore = ref.DBStore;

crypto = require('crypto');

_ = require('underscore');

_hasKeys = function(obj, keys) {
  var i, k, len;
  for (i = 0, len = keys.length; i < len; i++) {
    k = keys[i];
    if (!obj[k]) {
      return false;
    }
  }
  return true;
};

UserDoc = (function(superClass) {
  var md5;

  extend(UserDoc, superClass);

  function UserDoc() {
    return UserDoc.__super__.constructor.apply(this, arguments);
  }

  md5 = function(_str) {
    return crypto.createHash('md5').update(_str).digest('hex');
  };

  UserDoc.hash = function(str) {
    return md5(str);
  };

  UserDoc.store = "user";

  UserDoc.register = function(data) {
    if (!_hasKeys(data, ["email", "name", "password"])) {
      return Promise.reject({
        code: 406,
        msg: "needed more info to register",
        data: data
      });
    }
    return this.find({
      $or: [
        {
          email: data.email,
          name: data.name
        }
      ]
    }).then((function(_this) {
      return function(ret) {
        var user;
        if (ret.length) {
          return Promise.reject({
            code: 400,
            msg: "name or email already exists"
          });
        } else {
          data = _.extend({}, data, {
            password: _this.hash(data.password)
          });
          user = new _this(data);
          return user.save().then(function() {
            return user;
          });
        }
      };
    })(this));
  };

  UserDoc.login = function(data) {
    if (!data.password) {
      Promise.reject({
        code: 406,
        msg: "no password",
        data: data
      });
    }
    data.password = this.hash(data.password);
    return this.findOne(data).then(function(user) {
      return user;
    });
  };

  return UserDoc;

})(BaseDoc);

module.exports = UserDoc;
