var express, router;

express = require("express");

router = express.Router();

router.get("/", function(req, res) {
  return res.json("actions!");
});

module.exports = router;
