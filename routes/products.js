var express = require('express');
var router = express.Router();
var gravatar = require ('gravatar');
var Bookitem = require('../server/models/models');
var Comments = require ('../server/models/comments');
var Images = require('../server/models/images');
var Users = require('../server/models/users');
var genre = require('../server/models/genre');
var Reports = require ('../server/models/report');

/* GET products page. */
   router.get('/', function(req, res, next) {
 Images.findAll()
     .then(images=>{

      Users.findAll()
   .then(users=>{

    genre.findAll()
    .then(genre=>{
      res.render('products', {
         images: images,
         genre:genre,
           users:users,
          user : req.user,});
        })
     });
   });  
 });           
 








/* Shopping cart posting */
// router.get('/')


// router.post ('/', function (req, res){
//   console.log("Creating comments")

//   var commentData = {
//       title: req.body.title,
//       content: req.body.content,
//       user_id: req.user.name
//   }

//   Comments.create(commentData).then((newComment, created) => {
//       if (!newComment) {
//           return res.send(400, {
//               message: "error"
//           });
//       }

//       res.redirect('/products');
//   })
// });


module.exports = router;