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
  var seller = req.user.name;

  Bookitem.create({
    bookname1 : bookname,
    price1 : price,
    condition1 : condition,
    description1 : description,
    meetup1 : meetup,
    seller:seller,
  });

  res.redirect('/')
})  


router.get('/products',(req,res,next)=>{
  Bookitem.findAll()
  .then(retrievebook=>{
    console.log(retrievebook);
    res.render('products', {retrievebook: retrievebook});
  
  }); 
});

// router.get('/edit/:id',function (req,res) {
//   var booknumber = req.params.id;
//   Bookitem.findById(booknumber).then(function (retrievebook) {
//       res.render('edit', {
//           title: "Practical 5 Database Node JS - Edit Student Records",
//           item: retrievebook,
//           // hostPath: req.protocol + "://" + req.get("host")
//       });
//   }).catch((err) => {
//       return res.status(400).send({
//           message: err
//       });
//   });
// });

// router.post('/:id',function (req,res) {
//   var booknumber = req.params.id;
//   console.log("deleting" + booknumber);
//   Bookitem.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
//       if(!deletedRecord) {
//           return res.send(400, {
//               message: "error"
//           });
//       }
//       res.status(200).send({ message: "Deleted student record: " + record_num });
//   });
// }
// )




exports.hasAuthorization = function(req,res,next){
  if(req.isAuthenticated())
      return next();
  res.redirect('/login');
};

module.exports = router;


