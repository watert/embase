var Dispatcher, User, _, api, app, config, express, getRequesetData, retWithResponse, router;

express = require('express');

_ = require('underscore');

User = require("../models/user");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

config = require("../config");

app = require("../app");

router = express.Router();

retWithResponse = function(res) {
  return function(data) {
    var id, ret;
    ret = data._data || data;
    id = data.id || data._id || _.map(data, function(item) {
      return item.id || item._id;
    });
    return res.json({
      result: ret,
      id: id
    });
  };
};

getRequesetData = function(req) {
  var method;
  method = req.method;
  if (method === "GET") {
    return req.query;
  } else {
    return req.body;
  }
};

router.all("/api/restful/:id?", function(req, res) {
  var data, id, method, ret;
  method = req.method;
  id = req.params.id;
  data = getRequesetData(req);
  ret = retWithResponse(res);
  if (!id) {
    if (method === "GET") {
      User.find(data).then(ret);
    }
    if (method === "POST") {
      return (new User(data)).save().then(ret);
    }
  } else {
    return User.findOne({
      _id: id
    }).then(function(user) {
      if (method === "GET") {
        return user;
      }
      if (method === "PUT") {
        return user.save(data);
      }
      if (method === "DELETE") {
        return user.remove().then(function(num) {
          return {
            _id: id,
            deleted: true
          };
        });
      }
    }).then(ret);
  }
});

api = Dispatcher.createAPI(User, ["find", "findOne", "register"]);

router.all('/api/:method', function(req, res) {
  var data, method, ret;
  method = req.params.method;
  ret = retWithResponse(res);
  data = getRequesetData(req) || {};
  return api.call(method, data).then(function(data) {
    console.log("method " + method + " then");
    return ret(data);
  }).fail(function(err) {
    console.log("method " + method + " fail", err);
    return res.status(400).json(err);
  });
});

router.get('/*', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
