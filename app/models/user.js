var BaseDoc, DBStore, User, UserDoc, _, _hasKeys, crypto, q, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require("./db"), BaseDoc = ref.BaseDoc, DBStore = ref.DBStore;

crypto = require('crypto');

_ = require('underscore');

q = require("q");

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
  extend(UserDoc, superClass);

  UserDoc.store = "userdocs";

  function UserDoc(data) {
    UserDoc.__super__.constructor.call(this, data);
  }

  UserDoc.prototype.checkData = function(data) {
    var user;
    if (data == null) {
      data = this._data;
    }
    if (user = data.user) {
      console.log("has user data");
      data.user_id = user.id || user._id;
      delete data.user;
    }
    if (!data.user_id) {
      return {
        error: {
          code: 400,
          message: "UserDoc " + this.store + " must have user data or user_id"
        }
      };
    }
  };

  UserDoc.prototype.save = function(data) {
    var err, ref1;
    if (data == null) {
      data = null;
    }
    if (err = (ref1 = this.checkData(data)) != null ? ref1.error : void 0) {
      return q.reject({
        error: err
      });
    }
    return UserDoc.__super__.save.call(this, data);
  };

  return UserDoc;

})(BaseDoc);

User = (function(superClass) {
  var md5;

  extend(User, superClass);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.UserDoc = UserDoc;

  md5 = function(_str) {
    return crypto.createHash('md5').update(_str).digest('hex');
  };

  User.hash = function(str) {
    return md5(str);
  };

  User.store = "user";

  User.register = function(data) {
    if (!_hasKeys(data, ["email", "name", "password"])) {
      return Promise.reject({
        error: {
          code: 406,
          message: "needed more info to register"
        },
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
            error: {
              code: 406,
              message: "name or email already exists"
            }
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

  User.login = function(data) {
    if (!data.password) {
      Promise.reject({
        error: {
          code: 406,
          message: "no password"
        },
        data: data
      });
    }
    data.password = this.hash(data.password);
    return this.findOne(data).then(function(user) {
      return user;
    });
  };

  return User;

})(BaseDoc);

module.exports = User;
