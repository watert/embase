var Dispatcher, User, _, actions, api, express, method, router;

express = require('express');

_ = require('underscore');

router = express.Router();

User = require("../models/user");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

api = new Dispatcher();

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

api = new Dispatcher({
  actions: _.object(actions)
});

router.get('/api/:method', function(req, res) {
  method = req.params.method;
  return api.call(method).then(function(data) {
    console.log("method " + method + " then");
    return res.json(data);
  }).fail(function(err) {
    return res.status(400).json(err);
  });
});

router.get('/', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
