var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

    user : req.user, 
    res.render('chatPage');
})

module.exports = router;