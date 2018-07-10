var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');
var sequelize = myDatabase.sequelize;

router.post("/add", (req, res) => {
    // Test connection
    var message = req.body.message;
    console.log(message)
    var updateData = {
        avaliable : "In cart"
    }
    Images.update(updateData, { where: { id: req.body.bookID } }).then((updatedRecord) => {
        if(!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated student record: " + booknumber });
        res.redirect("backURL")
    })
    // Testing reply, add count
    var reply = {
        message: "",
        add_count: ""
    }

    // sequelize.query('SELECT ci.add_count FROM Cart_Items ci WHERE user_id = `req.body.userID`', {model: Cart_Items}).then((addCounts) => {
    //     reply.add_count = addCounts;
    // }
    // var Cart_Data = {
    //     book_id: req.body.bookID,
    //     user_id: req.body.userID
    //     // ...
    // }
    // Cart_Items.create()
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