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
    res.render('wishlist',
     { wishlist: wishlist,
      user : req.user,
      urlPath: req.protocol + "://" + req.get("host") + req.url
     });
  });
});


router.delete('/:id',function (req,res) {
  var booknumber = req.params.id;
  console.log("deleting" + booknumber);
  wishlist.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
      if(!deletedRecord) {
          return res.send(400, {
              message: "error"
          });
      }
      res.status(200).send({ message: "Deleted student record: " + booknumber });
  });
}
)

module.exports = router;