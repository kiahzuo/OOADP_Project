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
var admin = require("firebase-admin");
var app = express();
// Including neccessary "modules"...
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




// Bank routes, get and post
app.get('/bank',function(req, res){
    var users =  firebase.database().ref().child("users");
    var confirm =  firebase.database().ref().child("confirm");
    var x,y;
    users.on("value", function(snapshot) {
        x = snapshot.val();});
    confirm.on("value", function(snapshot) {
        y = snapshot.val();});
    res.render('bank',{
        test:x,
        confirm:y,});
});
app.post('/bank',function(req, res){
    console.log(req.body);
    var InputFirstName = req.body.InputFirstName;
    var InputLastName = req.body.InputLastName;
    var AccountNumber = req.body.AccountNumber;
    var AvailableBalance = req.body.AvailableBalance;
    var CreditcardNumber = req.body.CreditcardNumber;
    var ExpireMonth = req.body.ExpireMonth;
    var ExpireYear= req.body.ExpireYear;
    var CreditCardSC = req.body.CreditCardSC;
    var CreditDebit = req.body.CreditDebit;

    var users = firebase.database().ref().child("users");

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
    res.redirect('back');
});

app.post('/processingPayment/',function(req,res){
    console.log("Payment type A's PID: " + req.body.PID);
    console.log(req.body);
});

app.post('/bank/confirm',function(err,req,res){
    console.log(req.body);
    console.log(err.message);
    console.log(err.status);
});
/* END RAW ROUTES */

// Routers' routes
var bankRouter = require('./routes/bank');
// Assigning routers
app.use('/bank', bankRouter);

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

app.listen(4000,function(){
    console.log('Server Started on Port 4000...');
});
module.exports = app;
