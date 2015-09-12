var User, _, express, q, ret, router;

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

ret = function(res, data) {
  var id, result;
  result = data._data || data;
  id = data.id || data._id || _.map(data, function(item) {
    return item.id || item._id;
  });
  return res.json({
    result: result,
    id: id
  });
};

User = require("../models/user");

router.get('/user/api/*', function(req, res, next) {
  res.ret = (function(_this) {
    return function(data) {
      var id, result;
      console.log(_this);
      result = data._data || data;
      id = data.id || data._id || _.map(data, function(item) {
        return item.id || item._id;
      });
      res.json({
        result: result,
        id: id
      });
      return res;
    };
  })(this);
  res.retError = (function(_this) {
    return function(code, msg, data) {
      var err;
      if (data == null) {
        data = null;
      }
      err = {
        code: code,
        message: msg
      };
      res.status(code).json({
        result: data,
        error: err
      });
      return res;
    };
  })(this);
  console.log("set res.ret");
  return next();
});

router.get('/user/api', function(req, res) {
  if (req.session.user) {
    return res.json(req.session.user);
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
    return res.ret(data);
  }).fail(function(data) {
    return res.retError(400, "fail");
  });
});

router.get('/user/', function(req, res, next) {
  return res.render("index");
});

module.exports = router;
