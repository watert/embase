var _;

_ = require("underscore");

module.exports = function(req, res, next) {
  res.ret = function(data) {
    var id, result;
    result = data._data || data;
    id = data.id || data._id || _.map(data, function(item) {
      return item.id || item._id;
    });
    result = _.omit(result, "password");
    res.json({
      result: result,
      id: id
    });
    return res;
  };
  res.retError = function(code, msg, result) {
    var error;
    if (result == null) {
      result = null;
    }
    if (msg.error) {
      error = msg.error, result = msg.result;
    } else {
      error = {
        code: code,
        message: msg
      };
    }
    res.status(code).json({
      result: result,
      error: error
    });
    return res;
  };
  return next();
};
