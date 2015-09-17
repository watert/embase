var _, express, q, router, userRouter;

q = require('q');

express = require('express');

_ = require('underscore');

router = express.Router();

router.get('/codes/*', function(req, res) {
  return res.render("index");
});

router.get('/user/', function(req, res, next) {
  return res.render("index");
});

userRouter = require("../middlewares/user");

router.use('/user/', userRouter);

router.get('/*', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
