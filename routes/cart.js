var express = require('express');
var router = express.Router();

var Images = require('../server/models/images');
var Users = require('../server/models/users');
var Cart_Items = require('../server/models/cart');

/* GET books in cart of logged in user */
router.post('/:id/:uid', function(req, res, next) {
  var bookID = req.params.id;
  var userID = req.params.uid;
    Images.findById(bookID).then(function (images) {
      Cart_Items.findAll().then(function (cart_items) {  
        res.render('List_Cart_Items', {
            title: "Listing shopping cart",
            images : images,
            cart_items : cart_items,
            user : req.user.id,
            comments: comments,
            hostPath: req.protocol + "://" + req.get("host"),
            urlPath: req.protocol + '://' + req.get('host') + req.originalUrl,
        });
    })
    })

    .catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
});

module.exports = router;