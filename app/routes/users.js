var Dispatcher, User, _, app, config, express, jsonrpc, ref, restful, router;

express = require('express');

_ = require('underscore');

User = require("../models/user");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

config = require("../config");

app = require("../app");

router = express.Router();

ref = require("../middlewares/api"), restful = ref.restful, jsonrpc = ref.jsonrpc;

router.use("/api/restful/", restful({
  model: User
}), function(req, res, next) {
  return res.ret(res.restData);
});

router.use("/api/", jsonrpc({
  model: User,
  methods: ["find", "findOne", "register"]
}));

router.get('/*', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
