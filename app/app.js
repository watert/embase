var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression')
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// express.appPath = __dirname
app.set("appPath",__dirname);
// console.log("apppath",app.appPath);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"embase"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// app.set("env", "development");
// console.log("env", app.get('env'));
if (app.get('env') === 'development') {
    console.log("is dev");
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

if(require.main === module){
  var http = require("http");
  var port = process.env.PORT || 3000;
  app.set('port', port);

  var server = http.createServer(app);
  server.listen(port);
  console.log("Server start listening "+port);
}
// console.log("set exports", app);
module.exports = app;
