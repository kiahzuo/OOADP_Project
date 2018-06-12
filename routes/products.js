var express = require('express');
var router = express.Router();
var gravatar = require ('gravatar');
var Bookitem = require('../server/models/models');
var Comments = require ('../server/models/comments');

/* GET about page. */
router.get('/', function(req, res, next) {
  Bookitem.findAll()
  .then(retrievebook=>{
    console.log(retrievebook);
    res.render('products', {retrievebook: retrievebook});
  
  }); 
});


router.post ('/', function (req, res){
  console.log("Creating comments")

  var commentData = {
      title: req.body.title,
      content: req.body.content,
      user_id: req.user.name
  }

  Comments.create(commentData).then((newComment, created) => {
      if (!newComment) {
          return res.send(400, {
              message: "error"
          });
      }

      res.redirect('/products');
  })
});

router.get('/:id', function(req, res, next) {
  var booknumber = req.params.id;
  Bookitem.findById(booknumber).then(function (retrievebook) {
      res.render('viewbook', {
          title: "Practical 5 Database Node JS - Edit Student Records",
          retrievebook: retrievebook,
          hostPath: req.protocol + "://" + req.get("host")
      });
  }).catch((err) => {
      return res.status(400).send({
          message: err
      });
  });
});


module.exports = router;