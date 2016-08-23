var config = require('./config');
var dateFormat = require('dateformat');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

var routes = require('./routes/index')(passport);
var blogRoutes = require('./routes/blog');
var adminRoutes = require('./routes/admin');

var configurePassport = require('./passport/configure');
var isAdmin = require('./passport/isAdmin');

var app = express();

mongoose.connect(config.mongodbUrl, function(err) {
  if(err) {
    console.error(err);
  } else {
    console.log('Connected to MongoDB.');
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views', 'pages'));
app.set('view engine', 'ejs');
app.locals = {
  formatDate: function(date) {
    return dateFormat(date, 'mmm d, yyyy');
  }
};
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'mvjsasecretkey', maxAge: 1000*60*60*24}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

configurePassport(passport);

app.use('/', routes);
app.use('/blog',blogRoutes);
app.use('/admin', isAdmin, adminRoutes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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
    currentView: 'error',
    user: req.user,
    message: err.message,
    error: {}
  });
});


module.exports = app;
