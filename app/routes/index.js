var express, router;

express = require('express');

router = express.Router();

router.get('/', function(req, res, next) {
  return res.render('index', {
    title: 'Express'
  });
});

router.get('/codes/*', function(req, res) {
  return res.render("index");
});

router.get('/user/*', function(req, res, next) {
  if (req.session.user) {
    return next();
  } else {

  }
});

router.get('/user/', function(req, res, next) {
  return res.render("index");
});

router.post('/user/:action', function(req, res) {});

module.exports = router;
