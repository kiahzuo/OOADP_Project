var express = require('express');
var router = express.Router();

var Images = require('../server/models/images');
var Users = require('../server/models/users');

/* GET books in cart of logged in user */
router.get('/:id', function(req, res, next) {
  var booknumber = req.params.id;
    Images.findById(booknumber).then(function (images) {
        Cart_Items.findAll().then(function(cart){
            Images.findAll().then(function (images2) {  ``
        res.render('viewbook', {
            title: "Listing shopping cart",
            images: images,
            images2:images2,
            user : req.user,
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
});

module.exports = router;