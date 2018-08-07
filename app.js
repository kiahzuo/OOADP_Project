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
var request = require('request');
var app = express();
var Regex = require("regex");
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
    var history =  firebase.database().ref().child("history");
    var x,y,z;
    users.on("value", function(snapshot) {
        x = snapshot.val();});
    confirm.on("value", function(snapshot) {
        y = snapshot.val();});
    history.on("value", function(snapshot) {
        z = snapshot.val();});
    res.render('bank',{
        test:x,
        confirm:y,
        history:z});
});
app.post('/bank',function(req, res, err){
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

















app.post('/processingPayment',function(req,res){
    console.log('/processingpayment...........');
    console.log(req.body);
    var to = req.body.To.toString();
    var from = req.body.From.toString();
    var amount = parseFloat(req.body.Amount);
    var key,x,PPstatus,buyerdata, sellerdata,s$,b$;
    // JSON object to send back (reply)
    var PPdata = JSON.stringify({
        PID: req.body.PID,
        Status: "",
    });
    var transactiondata = {
        from:from,
        to:to,
        amount:amount,
    }
    //getting data from firebase
    //     x = snapshot.val();
    // users.on('value',function(snapshot){
    firebase.database().ref('/users/').once('value').then(function(snapshot) {
        x = snapshot.val();
        console.log('working');

        // TO
        for (key in x){
            if (x.hasOwnProperty(key)) {
                if (x[key].AccountNumber == to) {
                    console.log("[TO OPERATION]");
                    console.log(x[key].AccountNumber);
                    console.log(to);
                    s$ = key;
                    sellerdata ={
                        FirstName:          x[key].FirstName,
                        LastName:           x[key].LastName,
                        AccountNumber:      x[key].AccountNumber,
                        AvailableBalance:   parseFloat(x[key].AvailableBalance)-parseFloat(amount),
                        CreditcardNumber:   x[key].CreditcardNumber,
                        ExpireMonth:        x[key].ExpireMonth,
                        ExpireYear:         x[key].ExpireYear,
                        CreditCardSC:       x[key].CreditCardSC,
                        CreditDebit:        x[key].CreditDebit,
                        transaction:        x[key].transaction,
                    };
                    PPstatus = "Success";
                    console.log("PPs:"+PPstatus);
                    console.log("Sellerdata: "+ sellerdata);
                };
            };
        };
        
        // FROM
        for (key in x){
            if (x.hasOwnProperty(key)) {
                if (x[key].AccountNumber == from) {  
                    console.log("[FROM OPERATION]");
                    console.log(x[key].AccountNumber);
                    console.log("From: "+x[key].AccountNumber);
                    b$ = key;
                    buyerdata ={
                        FirstName:          x[key].FirstName,
                        LastName:           x[key].LastName,
                        AccountNumber:      x[key].AccountNumber,
                        AvailableBalance:   parseFloat(x[key].AvailableBalance)-parseFloat(amount),
                        CreditcardNumber:   x[key].CreditcardNumber,
                        ExpireMonth:        x[key].ExpireMonth,
                        ExpireYear:         x[key].ExpireYear,
                        CreditCardSC:       x[key].CreditCardSC,
                        CreditDebit:        x[key].CreditDebit,
                        transaction:        x[key].transaction,
                    };
                    PPstatus = "Success";
                    if (x[key].CreditDebit == "Debit") {
                        if (x[key].AvailableBalance < amount) {
                            PPstatus = "Insufficient Amount";
                        };
                    };
                    console.log(buyerdata);
                    console.log("PPs:"+PPstatus);
                };
            };
        };  
    // });
        console.log('Sending Firebase');
        console.log('b$: '+b$);
        console.log('s$: '+s$);
    // money going in n out
    // var bupdate = {};
    // var supdate = {};
    // bupdate['/users/' + b$] = buyerdata;
    // supdate['/users/' + s$] = sellerdata;
    // firebase.database().ref().update(bupdate);
    // firebase.database().ref().update(supdate);  
    // transaction history
    firebase.database().ref().child('/history/').push(transactiondata);
    firebase.database().ref().child('/users/'+s$+'/transaction').push(transactiondata);
    firebase.database().ref().child('/users/'+b$+'/transaction').push(transactiondata);
    console.log('Firebase Success');

    PPdata = JSON.stringify({
        PID: req.body.PID,
        Status: PPstatus,
    });
    res.status(200).send(PPdata);
    });
});










app.post('/checkCard',function(req,res){
    console.log('/checkcard...........');
    console.log(req.body);
    var reqccholder = req.body.cardHolder;
    reqccholder = reqccholder.replace(/\s+/g, '');
    var reqccnum = req.body.cardNumber;
    var reqmonth = req.body.expMonth;
    var reqyear = req.body.expYear;
    var reqcccvc = req.body.cardCVC;
    var userid = req.body.userID;
    var reqamount = req.body.amount;
    var x,key,CCct="nothing",CCStatus = "Insufficient Amount",y="";
    var CCdata = JSON.stringify({
        userID: req.body.userID,
        StatusExist: y, 
        StatusMoney: "",
        BankAccNo: "",
        CardType: "",
    })
    firebase.database().ref('/users/').once('value').then(function(snapshot) {
        x = snapshot.val();
        for (key in x){
            if (x.hasOwnProperty(key)) {
                var dbholder = x[key].FirstName+x[key].LastName
                var dbccnum = x[key].CreditcardNumber;
                var dbmonth = x[key].ExpireMonth;
                var dbyear = x[key].ExpireYear;
                var dbcccvc = x[key].CreditCardSC;
                var dbAC = x[key].AccountNumber;
                console.log('0');
                if (reqccholder.toUpperCase() == dbholder.toUpperCase()){
                    console.log('1');
                    if (reqccnum == dbccnum){
                        console.log('2');
                        if (parseInt(reqmonth) == dbmonth){
                            console.log('3');
                            if (reqyear == dbyear){
                                console.log('4');
                                if (reqcccvc == dbcccvc){
                                    console.log('5');
                                    if (x[key].CreditDebit == "Credit"){
                                        CCStatus = "Success"
                                    }else if (reqamount <= x[key].AvailableBalance){
                                        CCStatus = "Insufficient Amount";
                                    };
                                    number = reqccnum.replace(/\s+/g, '');
                                    // MasterCard
                                    if (/^5[1-5][0-9]{14}$/.test(number)) {
                                        CCct =  'Mastercard';
                                    }// Visa
                                    else if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) {
                                        CCct = 'Visa';
                                    }// Amex
                                    else if (/^3[47][0-9]{13}$/.test(number)) {
                                        CCct = 'Amex';
                                    }
                                    // Discover
                                    else if (/^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/.test(number)) {
                                        CCct = 'Discover';
                                    }

                                    CCdata = JSON.stringify({
                                        userID: req.body.userID,
                                        StatusExist: "Success", 
                                        StatusMoney: CCStatus,
                                        BankAccNo: dbAC,
                                        CardType: CCct,
                                    });
                                };
                            };
                        };
                    };
                };
                    console.log(CCdata);
                    console.log("Sending")
                    res.status(200).send(CCdata);
                    break;
                };
            // };
        };
    });
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
// Handling 500 errors
app.use(function(error, req, res, next) {
    console.log("Display error : ", error);
    res.end("Oups !", 500);
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

app.listen(4000, function(){
    console.log('Server started on port 4000...(Bank)');
});
