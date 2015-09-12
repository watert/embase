var User, _, express, q, router;

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

User = require("../models/user");

router.all('/user/api/*', function(req, res, next) {
  res.ret = function(data) {
    var id, result;
    result = data._data || data;
    id = data.id || data._id || _.map(data, function(item) {
      return item.id || item._id;
    });
    result = _.omit(result, "password");
    res.json({
      result: result,
      id: id
    });
    return res;
  };
  res.retError = function(code, msg, result) {
    var error;
    if (result == null) {
      result = null;
    }
    if (msg.error) {
      error = msg.error, result = msg.result;
    } else {
      error = {
        code: code,
        message: msg
      };
    }
    res.status(code).json({
      result: result,
      error: error
    });
    return res;
  };
  return next();
});

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

router.get('/user/', function(req, res, next) {
  return res.render("index");
});

module.exports = router;
