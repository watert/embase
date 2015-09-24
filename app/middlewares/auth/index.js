var Auth, User, _, app, express, q, renderPage, server;

_ = require("underscore");

express = require("express");

q = require("q");

User = require("./models/user");

renderPage = function(req, res) {
  return res.json("render login page");
};

Auth = function(options) {
  var router;
  router = express.Router();
  router.get("/user", function(req, res) {});
  router.get("/", renderPage);
  router.get("/page", renderPage);
  return router;
};

module.exports = Auth;


/* run directly, run as root router */

if (require.main === module) {
  app = express();
  app.use(Auth());
  server = app.listen(3000, function() {
    return console.log("Auth runs at 3000");
  });
}
