var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');
var Images = require('../server/models/images');
/* GET about page. */



router.delete('/:id',function (req,res) {
  var booknumber = req.params.id;
  console.log("deleting" + booknumber);
  Images.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
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