var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var Transactions = require('../server/models/transaction');
var sequelize = myDatabase.sequelize;

router.post("/cart/add/", (req, res) => {
    // Test connection
    var message = req.body.message;
    console.log(message)
    // Initialize "global" variables
    global.correct_add_count = 0;
    // Testing reply, add count
    var reply = {
        message: "",
        add_count: 0
    };
    /* NOTE, nesting the functions (to make use of scope) */
    /* Get and update/manipulate add_count (specific to user) */
    Cart_Items.max('add_count', { where: { user_id: req.body.userID } }).then(function(maxAddCount) {
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
            if (!updateRecord || updateRecord == 0) {
                return res.send(400, {
                    message: "Error, book record does not exist or unable to update"
                });
            } else {
                updateRecord.updateAttributes({
                    available: "In cart"
                });
            }
            /* Add new record to Cart_Items table */
            var Cart_Data = {
                book_id: req.body.bookID,
                user_id: req.body.userID,
                add_count: reply.add_count
            }
            Cart_Items.create(Cart_Data).then(function(newCartItem, failTest) {
                console.log(newCartItem.add_count);
                if (!newCartItem) {
                    return res.send(400, {
                        message: "error"
                    });
                }
                res.send(reply);
                // res.status(200).send({ message: "Updated cart for " + req.body.userID }); --> Example success reply
                // res.redirect("backURL")  --> Will change the URL in browser, should not be used here...
            });
        });
    
            // Failed code first try to get and manipulate add_count due to unknown return value from sequelize.query()
            // sequelize.query('SELECT max(add_count) FROM Cart_Items WHERE user_id = ? ;', {replacements:[req.body.userID]}, {type: sequelize.QueryTypes.SELECT}).then(function(maxAddCount){
            //     console.log("maxAddCount" + maxAddCount);
            //     console.log("maxAddcount" + maxAddCount.add_count);
            //     if (maxAddCount == "") {
            //          reply.add_count = 1 ;
            //     } else if (maxAddCount >= 5) {
            //         // Error, handle and reply error
            //     } else {
            //         reply.add_count++
            //     }
            // });
    });
});

router.post("/cart/show/", (req, res) => {
    Cart_Items.findAll({ where: { user_id: req.body.userID } }).then(userCartItems => {
        //console.log("Current user id is: " + user.id);
        // Test
        // console.log(user.id);
        // console.log(req.body.userID);
        // console.log("cart items; ");
        // console.log(userCartItems.length);
        // console.log(userCartItems[0].book_id);
        // console.log(userCartItems[1].user_id);

        // var bookIDArray = [];
        // f


        res.send(userCartItems); // Later change to userCartItemsData
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

module.exports = router;