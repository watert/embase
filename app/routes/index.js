var _, express, passport, q, router;

q = require('q');

express = require('express');

_ = require('underscore');

router = express.Router();

passport = require("passport");

router.use('/user/', function(req, res) {
  console.log(req.oauth2, req.user, req.session.user);
  return res.json("shit");
});

router.use('/auth/', require("../middlewares/auth")());

router.get('/*', function(req, res) {
  var ref;
  console.log("render index with user", req.user, req.session);
  return res.render('index', {
    title: 'Express',
    user: ((ref = req.user) != null ? ref._data : void 0) || null
  });
});

module.exports = router;
