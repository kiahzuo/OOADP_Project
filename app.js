var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

// routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var productsRouter = require('./routes/products');
var storeRouter = require('./routes/store');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var signupRouter = require('./routes/signup');
var editRouter = require('./routes/edit');
var viewbookRouter = require('./routes/viewbook');

var bankRouter = require('./routes/bank');


//import multer
var multer = require('multer');
var upload = multer({dest:'./public/uploads/',limits:{fileSize: 1500000, files:1} });

// Import login controller
var auth = require('./server/controller/auth');

//Import images controller
var images = require('./server/controller/images');


//Import comments controller
var comments = require('./server/controller/comments');



// Modules to store session
var myDatabase = require('./server/controller/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});


// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');




var express = require('express');
var app = express();
var router = express.Router();





// Passport configuration
require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

// required for passport
// secret for session
app.use(expressSession({
  secret: 'sometextgohere',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false,
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());

// Index Route

app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Delete function For Items
app.get('/profile', auth.isLoggedIn, auth.profile);
app.delete("/profile", auth.delete);



// Logout Page
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});




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
app.use('/store', auth.isLoggedIn, storeRouter);
app.use('/login',loginRouter);
app.use('/profile',profileRouter);
app.use('/signup',signupRouter);
app.use('/viewbook',viewbookRouter);
app.get('/about', comments.list);
app.delete('/about/:comments_id',comments.delete);

app.use('/edit',editRouter);

app.use('/bank',bankRouter);

//set up routes for images
app.get('/images-gallery', images.hasAuthorization, images.show);
app.post('/images', images.hasAuthorization, upload.single('image'), images.uploadImage);



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


app.listen(3000);



module.exports = app;


