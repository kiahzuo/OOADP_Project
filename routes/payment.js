var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var Transactions = require('../server/models/transaction');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op

/* Render checkout payment page page. */
router.get('/', function(req, res, next) {
    Cart_Items.findAll({ where: { user_id: req.user.id } }).then(userCartItems => {
        var bookIDArray = [];
        for (var i = 0; i < userCartItems.length; i++){
            bookIDArray.push(userCartItems[i].book_id);
        }
        Images.findAll({ where: { id: { [Op.in]: bookIDArray } } }).then(userCartItemsData => {
            var totalBookPrice = 0.00;
            for (var i = 0; i < userCartItemsData.length; i++){
                totalBookPrice += userCartItemsData[i].price1 ;
            }
            Users.find({ where: { id: req.user.id } }).then(function(userRecord) {
                var userCardNumber = userRecord.bankCardNo ;
                console.log(bookIDArray);
                console.log(totalBookPrice);
                res.render('payment', { 
                    title: 'Rendering payment details for checkout',
                    jsSendType: "Default",
                    user : req.user,
                    cartBookIDArray : bookIDArray,
                    cartTotalPrice : totalBookPrice,
                    userCardNo : userCardNumber,
                    hostPath: req.protocol + "://" + req.get("host"),
                    urlPath: req.protocol + '://' + req.get('host') + req.originalUrl, 
                    // Extra
                    paying: 99
                });
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
  if (req.body.userID == req.params.uid) {
    console.log("ID check successful")
  }
  var reply = {
    message: "",
  };

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
});

module.exports = router;