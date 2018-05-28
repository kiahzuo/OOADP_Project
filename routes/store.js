var express = require('express');
var router = express.Router();

/* GET store page. */

var Bookitem = require('../server/models/models');
router.get('/', function(req, res, next) {  
  res.render('store', { title: 'Express' });
});

router.post('/',(req,res,next) =>{
  var bookname = req.body.Book_Name;
  var price = req.body.price;
  var condition = req.body.condition;
  var description = req.body.description;
  var meetup = req.body.meetup;

  Bookitem.create({
    bookname1 : bookname,
    price1 : price,
    condition1 : condition,
    description1 : description,
    meetup1 : meetup,

  });
  res.redirect('/')
})

module.exports = router;


