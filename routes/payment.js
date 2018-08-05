var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var Transactions = require('../server/models/transaction');
var paymentCards = require('../server/models/paymentCards');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op

const BT_bankAccountNo = 3213165

/* Render checkout payment page. */
router.get('/', function(req, res, next) {
    Cart_Items.findAll({ where: { user_id: req.user.id } }).then(userCartItems => {
        var bookIDArray = [];
        for (var i = 0; i < userCartItems.length; i++){
            bookIDArray.push(userCartItems[i].book_id);
        }
        Images.findAll({ where: { id: { [Op.in]: bookIDArray } } }).then(userCartItemsData => {
            var totalBookPrice = 0.00;
            for (var i = 0; i < userCartItemsData.length; i++){
                totalBookPrice += userCartItemsData[i].price ;
            }
            Users.find({ where: { id: req.user.id } }).then(function(userRecord) {
                // NEED TO FIX (See database and EJS)
                var userCardNumber = 0;
                if (userRecord.bankCardNo != undefined) {
                    userCardNumber = userRecord.bankCardNo ;
                }
                else {
                    // Force user to enter the full credit card details on checkout.
                }
                console.log(bookIDArray);
                console.log(totalBookPrice);
                res.render('payment', { 
                    title: 'Rendering payment details for checkout',
                    jsSendType: "Default",
                    user : req.user,
                    userCardNo_L4 : userCardNumber.toString().substring(-1, 4),
                    hostPath: req.protocol + "://" + req.get("host"),
                    urlPath: req.protocol + '://' + req.get('host') + req.originalUrl, 
                    // Extra
                    paying: 99
                });
                // OTHER STUFF
            });
        });
    });
});

/* Render the page to register new bank account */
router.get('/new/', function(req, res, next) {
  // var user_id = req.params.uid;  --> Tried using URL parameter for "secruity", won't work normaly due to "trigger"
    //location.reload();
    res.render('registerCard', {
      title: "Registering new payment method...",
      jsSendType: "Register",
      user : req.user,
      hostPath: req.protocol + "://" + req.get("host"),
      urlPath: req.protocol + '://' + req.get('host') + req.originalUrl,
    })
});

/* Register the bank account for new users (For now is "required" upon signup) */
router.post("/new/:uid/", (req, res) => {
    if (req.body.userID == req.params.uid && req.user.id == req.body.userID) {
        console.log("ID check successful")
    }
    var reply = {
        message: "",
    };
  
    // Send data to bank server to check card
    var checkCardData = JSON.stringify({
        cardNumber: req.body.cardNumber,
        cardCVC: req.body.cardCVC,
        cardHolder: req.body.cardHolder,
        expMonth: req.body.expMonth,
        expYear: req.body.expYear,
        userID : req.body.user_ID
    })

    var options = {
        url: "http://localhost",
        port: 4000,
        path: "/checkCard/",
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        }
    }
    var sendTo400CC = http.request(options, function(res) {
        console.log("Sending card data to be checked");
        var responseStringCC = "";
        
        res.setEncoding("UTF8");
        res.on("data", function(data) {
            responseStringCC += data; // Save all data from response
            resCCJSON = JSON.parse(data) ;
            resCCStatus = resCCJSON.Status ;
            resCCType = resCCJSON.CCType ;
            resBankAccNo = resCCJSON.BankAccNo ;
        });
        res.on("end", function() {
            console.log(responseStringCC); // Print response to console when it ends
            console.log(resCCStatus);

            if (resCCStatus == "Exists") {
                /* Create new payment card record */
                var paymentCardData = {
                    cardNo: req.body.cardNumber,
                    cardType: resCCType,
                    bankAccountNo: resBankAccNo,
                    user_id: req.user.id
                }
                paymentCards.create(paymentCardData).then(function(newPaymentCard) {
                    if (req.body.CCDesignated) {
                        Users.find({ where: { id: req.body.userID } }).then(function(updateRecord) {
                            if (!updateRecord || updateRecord == 0) {
                                return res.send(400, {
                                    message: "Error, user does not exist or unable to update"
                                });
                            } else {
                                updateRecord.updateAttributes({
                                    bankCardNo: req.body.cardNumber,
                                    bankCardName: req.body.cardHolder
                                });
                                // reply.available = "In cart" --> Reference
                                res.status(200).send(reply); // Need return?
                            }
                        });
                    }
                });
            }
        });
    });
});

module.exports = router;