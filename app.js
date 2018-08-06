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
    var users =  database.child("users");
    var confirm =  database.child("confirm");
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

    var users = database.child("users");

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
    var to = req.body.To;
    var from = req.body.From;
    var amount = req.body.Amount;
    var pid = req.body.PID;
    var y,x,errorMessage,toc = false,acc = false,PPstatus;
    var users = database.child('users');
    var confirm = database.child("confirm");
    users.on('value',function(snapshot){
        x = snapshot.val();});
    confirm.on('value',function(snapshot){
        y = snapshot.val();});
    for (var key in x){
        if (test.hasOwnProperty(key)) {
            if (to == x[key].AccountNumber || to == x[key].CreditcardNumber) {
                if (from == x[key].AccountNumber || from == x[key].CreditcardNumber) {  
                    if (amount >= x[key].AvailableBalance){
                        PPstatus = "Success";
                        var date =   currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear();
                        var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                        //send to fire base the request
                        confirm.push({
                            Amount:amount,
                            Data:date,
                            From:from,
                            Time:time,
                            To:to,})
                    }else{
                        PPstatus = "Insufficient Amount";
                    };

                    var PPdata = JSON.stringify({
                        PID: req.body.PID,
                        Status: PPstatus,
                    });

                    // Min choose 1 'A' or 'B' idk if either works if both dont work use 'C'
                    // test in this order 'B' -> 'A' -> 'C'
                    // delete the other codes
                    // A
                    // if (res.status() == 200){
                    //     res.status(200).send(PPdata);
                    //     res.status(200).end();
                    // }else if (res.status() == 400){
                    //     res.status(400).send("Error")
                    //     res.status(400).end();
                    // };
                    // // end A

                    // // B
                    // res.status(num,function(){
                    //     if (num == 200){
                    //         res.status(200).send(PPdata);
                    //         res.status(200).end();
                    //     }else if (num == 400){
                    //         res.status(400).send("Error");
                    //         res.status(400).end();
                    //     }
                    // });
                    // end B

                    // C
                    console.log("Sending");
                    res.status(200).send(PPdata);
                    // end C

                }else{
                    console.log("To is not in database");
                    res.status(404).send("Invalid User");
                    res.status(404).end();
                }
            }else{
                console.log("From is not in database");
                    res.status(404).send("Invalid User");
                    res.status(404).end();
            };
        };
    };
});

app.post('/checkCard',function(req,res){
    console.log('/checkcard...........');
    console.log(req.body);
    var reqccholder = req.body.cardHolder;
    var reqccnum = req.body.cardNumber;
    var reqmonth = req.body.expMonth;
    var reqyear = req.body.expYear;
    var reqcccvc = req.body.cardCVC;
    var userid = req.body.userID;
    var reqamount = req.body.amount;
    var x,CCct,CCdata,CCStatus$ = "Insufficient Amount";
    users.on('value',function(snapshot){
        x = snapshot.val();});
    for (var key in x){
        if (test.hasOwnProperty(key)) {
            var dbccholder = x[key].FirstName+x[key].LastName;
            var dbccnum = x[key].CreditcardNumber;
            var dbmonth = x[key].ExpireMonth;
            var dbyear = x[key].ExpireYear;
            var dbcccvc = x[key].CreditCardSC;
            var dbAC = x[key].AccountNumber;
            if (reqccholder == dbccholder){
                if (reqccnum == dbccnum){
                    if (reqmonth == dbmonth){
                        if (reqyear == dbyear){
                            if (reqcccvc == dbcccvc){
                                console.log('match');
                                if (x[key].CreditDebit == "Credit"){
                                    CCStatus$ = "Success"
                                }else if (amount >= x[key.AvailableBalance]){
                                    CCStatus$ = "Success"
                                };
                                Stripe.setPublishableKey('pk_test_9D43kM3d2vEHZYzPzwAblYXl');
                                var cardType = Stripe.card.cardType(dbccnum);
                                switch (cardType) {
                                    case 'VISA': CCct = "Visa";
                                    case 'MasterCard': CCct = "MasterCard";
                                    case 'Discover': CCct = "Discover"
                                    case 'American Express': CCct = "AMEX";
                                }
                                CCdata = JSON.stringify({
                                    userID: req.body.userID,
                                    StatusExist: "Success", 
                                    StatusMoney: CCStatus$,
                                    BankAccNo: dbAC,
                                    CardType: CCct,
                                })
                                
                                // Min choose 1 'A' or 'B' idk if either works if both dont work use 'C'
                                // test in this order 'B' -> 'A' -> 'C'
                                // A
                                // if (res.status() == 200){
                                //     res.status(200).send(CCdata);
                                //     res.status(200).end();
                                // }else if (res.status() == 400){
                                //     res.status(400).send("Error")
                                //     res.status(400).end();
                                // };
                                // // end A

                                // // B
                                // res.status(num,function(){
                                //     if (num == 200){
                                //         res.status(200).send(CCdata);
                                //         res.status(200).end();
                                //     }else if (num == 400){
                                //         res.status(400).send("Error");
                                //         res.status(400).end();
                                //     }
                                // });
                                // end B

                                // C
                                console.log("Sending")
                                res.status(200).send(CCdata);
                                res.status(200).end();
                                // end C

                            }else{
                                console.log('cvc does not match');
                            }
                        }else{
                            console.log('year does not match');
                        }
                    }else{
                        console.log('month does not match');
                    }
                }else{
                    console.log('ccnum does not match');
                }
            }else{
                console.log('name does not match');
                // reply invalid creditcard information dont specify
                res.status(404).send("Invalid User");
                res.status(404).end();
            }

        };
    };
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

app.listen(4000, function(){
    console.log('Server started on port 4000...(Bank)');
});
module.exports = app;
