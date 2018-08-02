var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');
var http = require('http');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var Transactions = require('../server/models/transaction');
var Payments = require('../server/models/payments');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op

const BT_bankAccountNo = 3213165

router.post("/cart/add/", (req, res) => {
    // Test connection
    var message = req.body.message;
    console.log(message)
    // Initialize "global" variables
    global.correct_add_count = 0;
    // The reply has add count, available
    var reply = {
        message: "",
        add_count: 0,
        available: "available"
    };
    /* NOTE, nesting the functions (to make use of scope) */
    /* Get and update/manipulate add_count (to keep track and return to browser) */
    Cart_Items.count( { where: { user_id: req.body.userID } }).then(function(maxAddCount) {
        console.log("maxAddCount: " + maxAddCount);
        //console.log("Add count: " + correct_add_count);
        // Catch errors (first)
        if (maxAddCount == "" || isNaN(parseFloat(maxAddCount))) {
            reply.add_count = 1 ;
        } else if (maxAddCount >= 5) {
            // Error, handle and reply error of full cart
        } else {
            reply.add_count = maxAddCount+1 ;
        }
        /* Updating the available attribute (just a single attribute) */
        Images.find({ where: { id: req.body.bookID } }).then(function(updateRecord) {
            if (!updateRecord || updateRecord == 0 || updateRecord.available == "In cart" || updateRecord.available == "sold") {
                return res.send(400, {
                    message: "Error, book record does not exist or unable to update"
                });
            } else {
                updateRecord.updateAttributes({
                    available: "In cart"
                });
                reply.available = "In cart"
            }
            /* Add new record to Cart_Items table */
            var Cart_Data = {
                book_id: req.body.bookID,
                user_id: req.body.userID,
            }
            Cart_Items.create(Cart_Data).then(function(newCartItem, failTest) {
                if (!newCartItem) {
                    return res.send(400, {
                        message: "error"
                    });
                }
                res.status(200).send(reply);
                // res.status(200).send({ message: "Updated cart for " + req.body.userID }); --> Example success reply
                // res.redirect("backURL")  --> Will change the URL in browser, should not be used here...
            });
        });
    });
});

router.post("/cart/show/", (req, res) => {
    Cart_Items.findAll({ where: { user_id: req.body.userID } }).then(userCartItems => {
        //console.log("Current user id is: " + user.id); --> Error, server side does not have access to user session variable... (Should make it accessible?)
        // Test
        console.log(req.body.userID);
        console.log("cart items; ");
        console.log(userCartItems.length);

        var bookIDArray = [];
        for (var i = 0; i < userCartItems.length; i++){
            bookIDArray.push(userCartItems[i].book_id);
        }
        console.log(bookIDArray);

        Images.findAll({ where: { id: { [Op.in]: bookIDArray } } }).then(userCartItemsData => {
            res.status(200).send(userCartItemsData); // Subject to change
        });
    });
});

/* Return specific book's data for checking */
// router.get('/', function(req, res, next) {
//     Images.findAll()
//       .then(images=>{
//           Users.findAll()
//             .then(users=>{
  
//        res.send('products', {
//           images: images,
//             users:users,
//            user : req.user,});
    
//       });
//     });  
//     }); 

router.post("/cart/remove/:bid", (req, res) => {
    var reply = {
        message: "",
    }

    Cart_Items.destroy( {where: {book_id: req.body.bookID} } ).then((deletedItem) => {
        if(!deletedItem){
            return res.send(400, {
                message: "error"
            });
        }
        Images.find({ where: { id: req.body.bookID } }).then(function(updateRecord) {
            if (!updateRecord || updateRecord == 0 || updateRecord.available == "available" || updateRecord.available == "sold") {
                return res.send(400, {
                    message: "Error, book record does not exist or unable to update"
                });
            } else {
                updateRecord.updateAttributes({
                    available: "available"
                });
                reply.message = "Success!"
                res.status(200).send(reply); // No need return as this is last code block
            }
        });
    });
});

router.post("/cart/checkout/", (req, res) => {
    res.status(200).send(reply); // REFER TO cart.ejs
});

router.post('/checkout/all/', function(req, res, next) {
    // Need to change this later, when receiving from bank server...
    if (req.body.userID != req.user.id) {
        return res.send(400, {
            message: "Error, invalid user log"
        });
    }
    var currentTransactionID = 0;
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
                /* Special data */
                var userCardNumber = 0;
                var uniquePID = "";

                if (userRecord.bankCardNo != undefined) {
                    userCardNumber = userRecord.bankCardNo ;
                }
                else {
                    // ...
                }
                // Note that *checkCard* should execute before this
                console.log(bookIDArray);
                var bookIDArrayString = "";
                for (var i = 0; i < bookIDArray.length; i++){
                    bookIDArrayString += (bookIDArray[i].toString() + ',');
                }
                console.log("Payment A amount is:" + totalBookPrice);
                switch (req.body.paymentType) {
                    case 'A' :
                        /* Create new transaction record */
                        var Transaction_Data = {
                            buyer_id : req.body.userID,
                            book_ids : bookIDArrayString,
                            total_amount : totalBookPrice,
                            transaction_status: "Pending"
                        }
                        Transactions.create(Transaction_Data).then(function(newTransaction, failTest) {
                            if (!newTransaction) {
                                return res.send(400, {
                                    message: "error"
                                });
                            }

                            currentTransactionID = newTransaction.id ;
                            console.log("Transaction ID: " + currentTransactionID);
                            /* Create new payment record based on transaction */ 
                            var Payment_A_Data = {
                                user_id : req.user.id,
                                user_bank_account_no : userCardNumber,
                                payment_type: 'A',
                                transaction_id: currentTransactionID,
                                amount: totalBookPrice,
                                payment_status: "Pending"
                            }
                            Payments.create(Payment_A_Data).then(function(newPayment, failTest) {
                                if (!newPayment) {
                                    return res.send(400, {
                                        message: "error" // Should change this error to be "displayed" for better "user experience"
                                    });
                                }
                                // Will slice for identification upon reply/return
                                uniquePID = ('A' + currentTransactionID + ',' + newPayment.id).toString()
                                console.log("PID of payment type A:" + uniquePID);
                                // Send data to bank server
                                var paymentData = JSON.stringify({
                                    PID : uniquePID,
                                    To : BT_bankAccountNo,
                                    From: userCardNumber,
                                    Amount: totalBookPrice
                                })

                                var options = {
                                    url: "http://localhost:4000",
                                    port: 4000,
                                    path: "/processingPayment/",
                                    method: "POST",
                                    headers: {
                                        "contentType" : "application/json"
                                    }
                                }
                                var sendTo4000 = http.request(options, function(res){
                                    console.log("Sending payment type A data to 4000 (Test on same server first)");
                                    res.setEncoding("UTF8");
                                    res.on("data", function(chunk) {
                                        console.log("body: " + chunk);
                                    })
                                });
                                sendTo4000.write(paymentData);
                                sendTo4000.end();
                            });
                        });

                        break;

                    case 'B' :

                        break;
                }
            });
        });
    });
});

module.exports = router ;