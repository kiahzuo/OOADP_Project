var express = require('express');
var router = express.Router();
var Users = require ('../server/models/users');
var Images = require('../server/models/images');



// Retrieve update 1 by 1
router.get('/:id', function(req, res, next) {
    var usernumber = req.params.id;
    Users.findById(usernumber).then(function (users) {
        Images.findAll().then(function (images) {
        res.render('viewprofile', {
            title: "Practical 5 Database Node JS - Edit Student Records",
            users:users,
            images:images,
            user : req.user,
            hostPath: req.protocol + "://" + req.get("host"),
            urlPath: req.protocol + '://' + req.get('host') + req.originalUrl,

            
            
        });
    })
      
})
})



    module.exports = router;