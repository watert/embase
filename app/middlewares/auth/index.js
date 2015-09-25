var Auth, User, _, app, ejs, express, fs, logger, path, q, renderPage, renderTemplate, server, session;

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
  var data, html;
  data = _.pick(req, "baseUrl");
  _.extend(data, {
    title: "Common Auth"
  });
  html = renderTemplate("indexview.ejs", data);
  return res.type("html").send(html);
};

Auth = function(options) {
  var router, sessionAuth;
  router = express.Router();
  router.get("/user", function(req, res) {
    return res.json("/user");
  });
  router.use("/public", express["static"](path.join(__dirname, './public')));
  router.get("/test", function(req, res) {
    var html;
    html = renderTemplate("views/index.ejs", {
      baseUrl: req.baseUrl
    });
    return res.type("html").send(html);
  });
  router.get("/page", renderPage);
  router.use("/api", function(req, res, next) {
    res.retFail = function(err) {
      return res.status(err.error.code).json(err);
    };
    res.ret = function(ret) {
      delete ret._data["password"];
      return res.json({
        data: ret._data
      });
    };
    res.retPromise = function(promise) {
      return promise.then(res.ret).fail(res.retFail);
    };
    return next();
  });
  sessionAuth = function(req, res, next) {
    var ref, uid;
    uid = (ref = req.session.user) != null ? ref.id : void 0;
    console.log("sessionAuth", uid);
    if (!uid) {
      return res.retFail({
        error: {
          code: 401,
          msg: "unauthorized"
        }
      });
    } else {
      return User.findByID(uid).then(function(user) {
        req.user = user;
        return next();
      });
    }
  };
  router["delete"]("/api/", sessionAuth, function(req, res) {
    return req.user.remove().then(function(ret) {
      return {
        _data: ret
      };
    }).then(res.ret);
  });
  router.get("/api/", sessionAuth, function(req, res) {
    return res.ret(req.user);
  });
  router.put("/api/", sessionAuth, function(req, res) {
    return res.retPromise(req.user.set(_.omit(req.body, "_id")).save());
  });
  router.post("/api/profile", sessionAuth, function(req, res) {
    return res.ret(req.user);
  });
  router.post("/api/login", function(req, res) {
    return res.retPromise(User.login(req.body).then(function(ret) {
      req.session.user = ret;
      return ret;
    }));
  });
  router.post("/api/register", function(req, res) {
    return res.retPromise(User.register(req.body));
  });
  return router;
};


/* run directly, run as root router */

if (require.main === module) {
  app = express();
  server = app.listen(3000);
  console.log("listen 3000");
  module.exports = server;
  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded({
    extended: false
  }));
  app.use(require('cookie-parser')());
  app.use(require('compression')());
  session = require('express-session');
  app.use(session({
    secret: "embase",
    resave: true,
    saveUninitialized: false
  }));
  logger = require('morgan');
  app.use(logger('dev'));
  app.use("/auth", Auth());
} else {
  module.exports = Auth;
}
