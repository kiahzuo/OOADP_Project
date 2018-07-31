var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   var myUsername = req.user.name;
    console.log("chat load,username is: "+ myUsername)
    res.render('chatPage',{ chatUsername:myUsername});
})

module.exports = router;