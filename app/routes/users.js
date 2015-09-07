var Dispatcher, User, _, actions, api, app, config, express, method, router;

express = require('express');

_ = require('underscore');

User = require("../models/user");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

config = require("../config");

app = require("../app");

router = express.Router();

actions = (function() {
  var i, len, ref, results;
  ref = ["find"];
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    method = ref[i];
    results.push([method, User[method]]);
  }
  return results;
})();

console.log(config.appPath("db/user.db"));

api = Dispatcher.createAPI(User, ["find"]);

router.get('/api/:method', function(req, res) {
  method = req.params.method;
  console.log("method", method);
  return api.call(method).then(function(data) {
    console.log("method " + method + " then");
    return res.json(data);
  }).fail(function(err) {
    console.log("method " + method + " fail");
    return res.status(400).json(err);
  });
});

router.get('/', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
