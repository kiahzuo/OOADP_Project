var express = require('express');
var router = express.Router();

var wishlist = require('../server/models/wishlist')
var Bookitem = require('../server/models/models');
var Comments = require ('../server/models/comments');
var myDatabase = require('../server/controller/database');
var sequelize = myDatabase.sequelize;

router.get('/', function(req, res, next) {

  wishlist.findAll()
     .then(wishlist=>{
    res.render('about',
     { wishlist: wishlist,
      user : req.user,
     });
  });
});

module.exports = router;