var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var Transactions = require('../server/models/transaction');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op

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
                res.status(200).send(reply);
            }
        });
    });
});

router.post("/cart/checkout/", (req, res) => {
    res.status(200).send(reply);
});

module.exports = router ;