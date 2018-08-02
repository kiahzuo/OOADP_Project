var express = require('express');
var router = express.Router();
var User = require('../server/models/users');
var bcrypt = require('bcrypt')
var salt = bcrypt.genSaltSync(10);

router.get('/', function(req, res){
    res.render('change')
})

router.post('/', function(req, res){
    var currentpassword = req.body.currentpw;
    var newpassword = req.body.password;
    User.findOne({
        where : {
            id: req.user.id
        }
    }).then(function(user) {
        // if(currentpassword == user.password){
            if (bcrypt.compareSync(currentpassword, user.password)) {
            user.password = bcrypt.hashSync(newpassword, salt);
            //user.password = newpassword;
            user.save().then (() =>{
                res.redirect('/profile')
            })                        
        }

        else{
            req.flash('error', 'Please enter your previous password.');
            res.redirect('/change')
        }
    })
})


module.exports = router;