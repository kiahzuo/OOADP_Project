var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');

/* GET about page. */
router.get('/', function(req, res, next) {
  Bookitem.findAll()
  .then(retrievebook=>{
    console.log(retrievebook);
    res.render('profile', {retrievebook: retrievebook});
  
  }); 
});


router.delete('/:id',function (req,res) {
  var booknumber = req.params.id;
  console.log("deleting" + booknumber);
  Bookitem.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
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