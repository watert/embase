var Init, _, express, q, router,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

q = require('q');

express = require('express');

_ = require('underscore');

router = express.Router();

Init = function(options) {
  var UserCodes, UserDoc, app, crypto, findUsers, getPageData, injectUser, jsonrpc, md5, ref, restful, restfulCodes, retJSON;
  app = options.app;
  UserDoc = require("../models/user.coffee").UserDoc;
  findUsers = function(ids) {
    return app.User.find({
      _id: {
        $in: ids
      }
    }).then(function(docs) {
      return _.map(docs, function(user) {
        return _.omit(user, "password");
      });
    });
  };
  ref = require("../middlewares/api.coffee"), restful = ref.restful, jsonrpc = ref.jsonrpc, retJSON = ref.retJSON;
  UserCodes = (function(superClass) {
    extend(UserCodes, superClass);

    function UserCodes() {
      return UserCodes.__super__.constructor.apply(this, arguments);
    }

    UserCodes.store = "usercodes";

    return UserCodes;

  })(UserDoc);
  restfulCodes = restful({
    model: UserCodes,
    parseReturn: function(docs) {
      var uid;
      console.log("parseReturn", docs);
      if (uid = docs.user_id) {
        return findUsers([uid]).then(function(users) {
          docs.user = users != null ? users[0] : void 0;
          return docs;
        });
      }
      return docs;
    }
  });
  injectUser = function(req, res, next) {
    var ref1;
    if (req.method !== "GET") {
      req.body.user_id = (ref1 = req.user) != null ? ref1.id : void 0;
    }
    return next();
  };
  router.use("/api/usercodes/", injectUser, restfulCodes);
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
  return router;
};

module.exports = Init;
