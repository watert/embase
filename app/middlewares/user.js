var User, _, api, articleREST, crypto, express, md5, renderIndex, router, rpcRouter, userInfo, userRemove;

express = require('express');

_ = require("underscore");

User = require("../models/user");

api = require("../middlewares/api");

router = express.Router();

crypto = require("crypto");

rpcRouter = api.jsonrpc({
  model: User,
  events: {
    "login": function(req, res) {
      console.log("on login", res.data);
      return req.session.user = res.data;
    }
  }
});

articleREST = api.restful({
  model: User.UserDoc,
  parseData: function(data) {
    var user;
    user = this.req.session.user;
    if (!user) {
      return {
        error: {
          message: "not logined",
          code: 406
        }
      };
    }
    if (data.user_id && data.user_id !== user.id) {
      return {
        error: {
          message: "not your doc",
          code: 406
        }
      };
    }
    return _.extend({}, data, {
      user_id: user.id
    });
  }
});

md5 = function(_str) {
  return crypto.createHash('md5').update(_str).digest('hex');
};

userRemove = function(req, res) {
  var _id, ref;
  return User.remove((ref = req.params, _id = ref._id, ref)).then(res.ret);
};

userInfo = function(req, res) {
  var user;
  if (user = req.session.user) {
    user._data.emailHash = md5(user._data.email);
    return res.ret(user);
  } else {
    return res.retError(406, "not logined");
  }
};

renderIndex = function(req, res) {
  return res.render("index");
};

router.use('/api/', rpcRouter);

router["delete"]('/api/:_id', userRemove);

router.get('/api/', userInfo);

router.get('/api/logout', function(req, res) {});

router.use('/docs/article/', articleREST);

router.use('/*', renderIndex);

module.exports = router;
