var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');

/* GET about page. */
router.get('/', function(req, res, next) {
  Bookitem.findAll()
  .then(retrievebook=>{
    console.log(retrievebook);
    res.render('products', {retrievebook: retrievebook});
  
  }); 
});

module.exports = router;