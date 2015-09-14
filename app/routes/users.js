var Dispatcher, User, _, app, config, express, getRequesetData, jsonrpc, restful, retWithResponse, router, utilRouter;

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

utilRouter = require("../middlewares/util");

getRequesetData = utilRouter.getRequesetData;

restful = require("../middlewares/restful");

router.use('/api/*', utilRouter());

router.use("/api/restful/", restful({
  model: User
}), function(req, res, next) {
  return res.ret(res.restData);
});

jsonrpc = require("../middlewares/jsonrpc");

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
