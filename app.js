var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var productsRouter = require('./routes/products');
var storeRouter = require('./routes/store');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var signupRouter = require('./routes/signup');



var express = require('express');
var app = express();
var router = express.Router();








app.listen(3000);





// view engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/store', storeRouter);
app.use('/login',loginRouter);
app.use('/profile',profileRouter);
app.use('/signup',signupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
