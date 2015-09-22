var AdminDocModel, DBStore, Dispatcher, User, UserArticle, UserFile, _, app, config, express, fs, jsonrpc, q, ref, restful, retJSON, router,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

express = require('express');

_ = require('underscore');

fs = require('fs');

q = require('q');

User = require("../models/user");

Dispatcher = require("../../public/scripts/libs/action-dispatcher");

config = require("../config");

DBStore = require("../models/db").DBStore;

app = require("../app");

router = express.Router();

AdminDocModel = (function(superClass) {
  extend(AdminDocModel, superClass);

  function AdminDocModel() {
    return AdminDocModel.__super__.constructor.apply(this, arguments);
  }

  return AdminDocModel;

})(require("../models/db").BaseDoc);

UserArticle = (function(superClass) {
  extend(UserArticle, superClass);

  function UserArticle() {
    return UserArticle.__super__.constructor.apply(this, arguments);
  }

  UserArticle.store = "userdocs";

  return UserArticle;

})(AdminDocModel);

UserFile = (function(superClass) {
  extend(UserFile, superClass);

  function UserFile() {
    return UserFile.__super__.constructor.apply(this, arguments);
  }

  UserFile.store = "userfiles";

  return UserFile;

})(AdminDocModel);

ref = require("../middlewares/api"), restful = ref.restful, jsonrpc = ref.jsonrpc, retJSON = ref.retJSON;

router.get("api/*", function(req, res, next) {
  return req.query != null ? req.query : req.query = {};
});

router.use("/api/users/", restful({
  model: User,
  parseReturn: function(data) {
    return _.omit(data, "password");
  }
}));

router.use("/api/users/", jsonrpc({
  model: User
}));

router.use("/api/articles/", restful({
  model: UserArticle
}));

router.use("/api/files/", restful({
  model: UserFile
}));

router.post("/api/status/", retJSON(), function(req, res) {
  return DBStore.dbStatus().then(function(data) {
    data = data.map(function(row) {
      return _.omit(row, "path");
    });
    return res.ret(data);
  });
});

router.get('/*', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
