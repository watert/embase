var User, _, api, articleREST, crypto, express, md5, multipart, q, renderIndex, router, rpcRouter, userInfo, userRemove;

express = require('express');

q = require('q');

_ = require("underscore");

User = require("../models/user");

api = require("../middlewares/api");

router = express.Router();

crypto = require("crypto");

rpcRouter = api.jsonrpc({
  model: User,
  events: {
    "login": function(req, res) {
      console.log("on login", res.data);
      return req.session.user = res.data;
    }
  }
});

articleREST = api.restful({
  model: User.UserDoc,
  parseData: function(data) {
    var user;
    user = this.req.session.user;
    if (!user) {
      return {
        error: {
          message: "not logined",
          code: 406
        }
      };
    }
    if (data.user_id && data.user_id !== user.id) {
      return {
        error: {
          message: "not your doc",
          code: 406
        }
      };
    }
    return _.extend({}, data, {
      user_id: user.id
    });
  }
});

md5 = function(_str) {
  return crypto.createHash('md5').update(_str).digest('hex');
};

userRemove = function(req, res) {
  var _id, ref;
  return User.remove((ref = req.params, _id = ref._id, ref)).then(res.ret);
};

userInfo = function(req, res) {
  var user;
  if (user = req.session.user) {
    user._data.emailHash = md5(user._data.email);
    return res.ret(user);
  } else {
    return res.retError(406, "not logined");
  }
};

renderIndex = function(req, res) {
  return res.render("index");
};

router.all('/api/logout', function(req, res) {
  req.session.destroy();
  return res.json({
    message: "Logout successfully"
  });
});

router.post('/api/status/', api.retJSON(), function(req, res) {
  var result, user, where;
  user = req.session.user;
  where = {
    user_id: user.id
  };
  result = {};
  return User.UserDoc.count(where).then(function(ret) {
    result.docCount = ret.count;
    return User.UserFile.count(where);
  }).then(function(ret) {
    result.filesCount = ret.count;
    return res.ret(result);
  });
});

router.use('/api/', rpcRouter);

router["delete"]('/api/:_id', userRemove);

router.get('/api/', userInfo);

router.use('/docs/article/', articleREST);

router.use('/docs/article/api', api.jsonrpc({
  model: User.UserDoc
}));

multipart = require("connect-multiparty")({
  uploadDir: __dirname + "/../tmpfiles/"
});

router.use("/files/", multipart, api.restful({
  model: User.UserFile,
  parseData: function(data) {
    var files, user;
    user = this.req.session.user;
    data.user_id = user.id;
    if (files = this.req.files) {
      _.extend(data, files);
    }
    return data;
  }
}));

router.use('/*', renderIndex);

module.exports = router;
