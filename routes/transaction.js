var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var sequelize = myDatabase.sequelize;

router.post("/cart/add", (req, res) => {
    // Test connection
    var message = req.body.message;
    console.log(message)
    /* First try updating */
    // var updateData = {
    //     avaliable : "In cart"
    // }
    // Images.update(updateData, { where: { id: req.body.bookID } }).then((updatedRecord) => {
    //     if(!updatedRecord || updatedRecord == 0) {
    //         return res.send(400, {
    //             message: "error"
    //         });
    //     };
    /* Second try, just updating one attribute */
    Images.find({ where: { id: req.body.bookID } }).then(function(updateRecord) {
        if (!updateRecord || updateRecord == 0) {
            return res.send(400, {
                message: "Error, book record does not exist"
            });
        } else {
            updateRecord.updateAttributes({
                avaliable: "In cart"
            });
        }
        // res.status(200).send({ message: "Updated cart for " + req.body.userID });
        // res.redirect("backURL")  --> Will change the URL in browser, should not be used here...
    })
    // Testing reply, add count
    var reply = {
        message: "",
        add_count: 0
    }
    var add_count = 0;
    // Unknwon return value.
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

    // Alternative
    Cart_Items.max('add_count', {where: {user_id: req.body.userID}}).then(function(maxAddCount) {
        console.log("maxAddCount: " + maxAddCount);
        // Catch errors (first)
        add_count = maxAddCount+1 ;
        console.log("Add count: " + add_count);
        // if (maxAddCount == "") {
        //      reply.add_count = 1 ;
        // //} else if (maxAddCount >= 5) {
        //     // Error, handle and reply error
        // } else {
        //     reply.add_count = maxAddCount+1 ;
        // }
    });

    var Cart_Data = {
        book_id: req.body.bookID,
        user_id: req.body.userID,
        add_count: add_count
    }
    Cart_Items.create(Cart_Data).then(function(newCartItem, failTest) {
        console.log(newCartItem.add_count);
        if (!newCartItem) {
            return res.send(400, {
                message: "error"
            });
        }
    })
    res.send(reply);
})




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