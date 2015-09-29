var User, UserCodes, _, crypto, express, getPageData, jsonrpc, md5, q, ref, restful, restfulCodes, retJSON, router,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

q = require('q');

express = require('express');

_ = require('underscore');

router = express.Router();

User = require("../models/user");

ref = require("../middlewares/api"), restful = ref.restful, jsonrpc = ref.jsonrpc, retJSON = ref.retJSON;

UserCodes = (function(superClass) {
  extend(UserCodes, superClass);

  function UserCodes() {
    return UserCodes.__super__.constructor.apply(this, arguments);
  }

  UserCodes.store = "usercodes";

  return UserCodes;

})(User.UserDoc);

restfulCodes = restful({
  model: UserCodes
});

router.use("/api/usercodes/", restfulCodes);

crypto = require("crypto");

md5 = function(_str) {
  return crypto.createHash('md5').update(_str).digest('hex');
};

getPageData = function(req) {
  var data, email, ref1, ref2, user;
  user = ((ref1 = req.user) != null ? ref1._data : void 0) || null;
  if (email = user != null ? user.email : void 0) {
    user.emailHash = md5(email);
  }
  data = {
    user: ((ref2 = req.user) != null ? ref2._data : void 0) || null
  };
  return data;
};

router.use(function(req, res, next) {
  var data, email, ref1, ref2, user;
  user = ((ref1 = req.user) != null ? ref1._data : void 0) || null;
  if (email = user != null ? user.email : void 0) {
    user.emailHash = md5(email);
    user.avatar = "http://www.gravatar.com/avatar/" + user.emailHash + "?s=80";
  }
  data = {
    user: ((ref2 = req.user) != null ? ref2._data : void 0) || null
  };
  req.pageData = data;
  return next();
});

router.get('/*', function(req, res) {
  return res.render('index', {
    title: 'Express',
    data: req.pageData
  });
});

_.extend(router, {
  getPageData: getPageData
});

module.exports = router;
