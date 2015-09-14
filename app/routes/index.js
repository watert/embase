var User, _, api, articleAPI, express, q, router, rpcRouter;

q = require('q');

express = require('express');

_ = require('underscore');

router = express.Router();

router.get('/', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

router.get('/codes/*', function(req, res) {
  return res.render("index");
});

router.get('/user/', function(req, res, next) {
  return res.render("index");
});

User = require("../models/user");

api = require("../middlewares/api");

router.use('/user/api/*', api.retJSON());

rpcRouter = api.jsonrpc({
  model: User,
  events: {
    "login": function(req, res) {
      console.log("on login", res.data);
      return req.session.user = res.data;
    }
  }
});

router.use('/user/api/', rpcRouter);

router["delete"]('/user/api/:_id', function(req, res) {
  var _id, ref;
  return User.remove((ref = req.params, _id = ref._id, ref)).then((function(_this) {
    return function(ret) {
      return res.ret(ret);
    };
  })(this));
});

router.get('/user/api/', function(req, res) {
  var user;
  if (user = req.session.user) {
    return res.ret(user);
  } else {
    return res.retError(406, "not logined");
  }
});

articleAPI = api.restful({
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

router.use('/user/docs/article/', articleAPI);

module.exports = router;
