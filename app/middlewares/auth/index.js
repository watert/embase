var Auth, User, _, app, ejs, express, fs, path, q, renderPage, renderTemplate, server;

_ = require("underscore");

express = require("express");

q = require("q");

User = require("./models/user");

ejs = require("ejs");

path = require("path");

fs = require('fs');

renderTemplate = function(filename, data) {
  var file, filePath, tmpl;
  filePath = path.join(__dirname, filename);
  file = fs.readFileSync(filePath, 'utf8');
  tmpl = ejs.compile(file, {
    cache: true,
    filename: "indexview"
  });
  return tmpl(data);
};

renderPage = function(req, res) {
  var html;
  html = renderTemplate("indexview.ejs", {
    title: "Hello World"
  });
  return res.type("html").send(html);
};

Auth = function(options) {
  var router;
  router = express.Router();
  router.get("/user", function(req, res) {
    return res.json("/user");
  });
  router.use("/public", express["static"](path.join(__dirname, './public')));
  router.get("/", renderPage);
  router.get("/page", renderPage);
  return router;
};


/* run directly, run as root router */

if (require.main === module) {
  app = express();
  app.use(Auth());
  server = app.listen(3000);
  module.exports = server;
} else {
  module.exports = Auth;
}
