// Variables for modules
var express = require('express');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var router = express.Router();
var firebase = require('firebase');


// routes
var indexRouter = require('./routes/index');``
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var productsRouter = require('./routes/products');
var storeRouter = require('./routes/store');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var signupRouter = require('./routes/signup');
var editRouter = require('./routes/edit');
var viewbookRouter = require('./routes/viewbook');
var viewprofileRouter = require('./routes/viewprofile');
var paymentRouter = require('./routes/payment');
var bankRouter = require('./routes/bank');


// firebase
var admin = require("firebase-admin");
var app = express();
// 
app.use(logger('dev'));
// app.use(bodyParser.json()); // Updated Express, can just use express.json()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
// View engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//import multer
var multer = require('multer');
var upload = multer({dest:'./public/uploads/',limits:{fileSize: 1500000, files:2} });
// firebase (for payment)
var config = {
    apiKey: "AIzaSyBcI54P-yTiaNAXEDASZGH3eJNkcbXY7wE",
    authDomain: "ooadp-2018-sem1-e409b.firebaseapp.com",
    databaseURL: "https://ooadp-2018-sem1-e409b.firebaseio.com",
    projectId: "ooadp-2018-sem1-e409b",
    storageBucket: "ooadp-2018-sem1-e409b.appspot.com",
    messagingSenderId: "1025088843498"
  };
firebase.initializeApp(config);
var database = firebase.database().ref();

// Import login controller
var auth = require('./server/controller/auth');
//Import images controller
var images = require('./server/controller/images');
//Import genre controller
var genre = require('./server/controller/genre');
//Import wishlist
var wishlist = require('./server/controller/wishlist');
//Import comments controller
var comments = require('./server/controller/comments');
//Import transaction controller
// var transaction = require('./server/controller/transaction');

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
// Passport configuration
require('./server/config/passport')(passport);
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
//User session
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// Login routes, get and post
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));
// Signup routes, get  and post
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Delete function rotes for items, get and delete
app.get('/profile', auth.isLoggedIn, auth.profile);
app.delete("/profile", auth.delete);

// Logout page routes, get
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Payment routes, get and post
app.get('/payment', function(req, res){
    res.render('payment.ejs',{
        paying: '99',
    });
});

app.post('/payment', function(req, res){
    console.log("=== Start ===");
    console.log(req.body);
    var cardNumber = req.body.cardNumber;
    var cardHolder = req.body.cardHolder;
    var cardHolder_verify = cardHolder.replace(/\s/g, '').toUpperCase();
    var cardMonth = req.body.cardMonth;
    var cardYear = req.body.cardYear;
    var cardCVC = req.body.cardCVC;
    var cardamount = req.body.amount;
    console.log(cardamount);

    var users =  firebase.database().ref().child("users");
    users.on("value", function(snapshot) {
        var confirm =  firebase.database().ref().child("confirm");
        var x = snapshot.val();
        for (var key in x){
            if (x.hasOwnProperty(key)){
                var db_cn = x[key].CreditcardNumber;
                var db_ch = x[key].FirstName + x[key].LastName;
                var db_ch_verify = db_ch.replace(/\s/g, '').toUpperCase();
                var db_em = x[key].ExpireMonth;
                var db_ey = x[key].ExpireYear;
                var db_cvc = x[key].CreditCardSC;
                if (cardNumber == db_cn){
                    if (cardHolder_verify == db_ch_verify){
                        if (cardMonth == db_em){
                            if (cardYear == db_ey){
                                if (cardCVC == db_cvc){
                                    console.log("PASS!");
                                    console.log("User key : " + key);
                                    var currentdate = new Date(); 
                                    var date =   currentdate.getDate() + "/"
                                                    + (currentdate.getMonth()+1)  + "/" 
                                                    + currentdate.getFullYear()
                                    var time = currentdate.getHours() + ":"  
                                    + currentdate.getMinutes() + ":" 
                                    + currentdate.getSeconds();
                                    confirm.push({
                                        Key:key,
                                        Date:date,
                                        Time:time,
                                    });
                                }else{
                                    console.log("FAIL!")
                                }
                            }
                        }
                    }
                }
                // end nested if
            }
            // end if
        }
        // end for
    });
});

// Bank routes, get and post
app.get('/bank',function(req, res){
    var users =  firebase.database().ref().child("users");
    
    users.on("value", function(snapshot) {
        console.log(snapshot.val());
        var x = snapshot.val();
        res.render('bank',{
            test:x,
        });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    
});
app.post('/bank',function(req, res){
    var InputFirstName = req.body.InputFirstName;
    var InputLastName = req.body.InputLastName;
    var AccountNumber = req.body.AccountNumber;
    var AvailableBalance = req.body.AvailableBalance;
    var CreditcardNumber = req.body.CreditcardNumber;
    var ExpireMonth = req.body.ExpireMonth;
    var ExpireYear= req.body.ExpireYear;
    var CreditCardSC = req.body.CreditCardSC;
    var CreditDebit = req.body.CreditDebit;

    var users =  firebase.database().ref().child("users");

    users.push({
        FirstName:InputFirstName,
        LastName:InputLastName,
        AccountNumber:AccountNumber,
        AvailableBalance:AvailableBalance,
        CreditcardNumber:CreditcardNumber,
        ExpireMonth:ExpireMonth,
        ExpireYear:ExpireYear,
        CreditCardSC:CreditCardSC,
        CreditDebit:CreditDebit
    });
    res.redirect('/bank');
})

// Routers' routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// var aboutRouter = require('./routes/about');

var productsRouter = require('./routes/products');
var storeRouter = require('./routes/store');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var signupRouter = require('./routes/signup');
var editRouter = require('./routes/edit');
var viewbookRouter = require('./routes/viewbook');
var viewprofileRouter = require('./routes/viewprofile');
// var transactionRouter = require('./routes/transaction');
var paymentRouter = require('./routes/payment');
var bankRouter = require('./routes/bank');
// Assigning routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', auth.isLoggedIn,productsRouter, images.filterCategories );
app.use('/store', auth.isLoggedIn, storeRouter,images.hasAuthorization, upload.single('image'), images.uploadImage);
app.use('/login',loginRouter);
app.use('/profile',profileRouter,images.filterCategories2);
app.use('/signup',signupRouter);
app.use('/viewbook',viewbookRouter,wishlist.create);
app.use('/viewprofile',viewprofileRouter);
app.use('/transaction', transactionRouter);
app.use('/bank', bankRouter);
app.use('/payment', paymentRouter);
// Book edit HTTP request handlers
app.use('/edit', editRouter);
app.post("/edit/:id", upload.single('imageName'),images.updateImage)
app.get("/edit/:id", images.show);

<<<<<<< HEAD
// app.use('/transaction', transactionRouter);
app.use('/bank', bankRouter);
app.use('/payment', paymentRouter);
=======
>>>>>>> fddc0459570329e6410a7d271697c3f273778cfc

// adding new genre
app.post('/genre', genre.create)


// wishlist HTTP request handlers
app.get('/wishlist',wishlist.show)
app.delete('/wishlist/:id',wishlist.delete)

// app.get('/about', comments.list);

app.post('/viewbook1', wishlist.create)
app.post('/store', images.hasAuthorization, upload.single('image'), images.uploadImage);

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
