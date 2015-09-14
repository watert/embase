var Dispatcher, _, express, getRequesetData;

_ = require("underscore");

express = require("express");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

getRequesetData = require("./util").getRequesetData;

module.exports = function(options) {
  var Model, api, router;
  if (options == null) {
    options = {};
  }
  Model = options.model;
  router = express.Router();
  api = Dispatcher.createAPI(Model, options.methods);
  router.post("/:method?", function(req, res) {
    var data, method;
    method = req.params.method;
    data = getRequesetData(req) || {};
    return api.call(method, data).then(function(data) {
      return res.ret(data);
    }).fail(function(err) {
      return res.status(400).retError(err);
    });
  });
  return router;
};
