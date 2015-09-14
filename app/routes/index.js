var User, _, express, q, retJSON, router;

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

retJSON = require("../middlewares/util").retJSON;

router.use('/user/api/*', retJSON());

router["delete"]('/user/api/:_id', function(req, res) {
  var _id, ref;
  return User.remove((ref = req.params, _id = ref._id, ref)).then((function(_this) {
    return function(ret) {
      return res.ret(ret);
    };
  })(this));
});

router.get('/user/api/', function(req, res) {
  if (req.session.user) {
    return res.ret(req.session.user);
  } else {
    return res.status(406).retError(406, "not logined");
  }
});

router.post('/user/api/:action', function(req, res) {
  var act, dfd;
  act = req.params.action;
  dfd = User[act](req.body);
  if (!User[act]) {
    res.retError(500, "method " + act + " not exists");
  }
  return q.when(dfd).then(function(data) {
    console.log(act, "then data", data);
    req.session.user = data;
    return res.ret(data);
  }).fail(function(data) {
    return res.retError(400, data);
  });
});

module.exports = router;
