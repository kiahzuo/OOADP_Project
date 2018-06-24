var express = require('express');
var router = express.Router();
var Images = require('../server/models/images');




/* GET about page. */
router.get('/', function(req, res, next) {
    Images.findAll()
    .then(images=>{
      console.log(images);
      res.render('sciencefiction', {images: images,
        user : req.user,});
    
    }); 
  });

  module.exports = router;  