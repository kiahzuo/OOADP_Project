var express = require('express');
var router = express.Router();
var gravatar = require ('gravatar');
var Bookitem = require('../server/models/models');
var Comments = require ('../server/models/comments');
var myDatabase = require('../server/controller/database');
var Images = require('../server/models/images');
var wishlist = require('../server/models/wishlist');

var sequelize = myDatabase.sequelize;

// Retrieve update 1 by 1
router.get('/:id', function(req, res, next) {
    var booknumber = req.params.id;
    Images.findById(booknumber).then(function (images) {
        Comments.findAll().then(function(comments){
            Images.findAll().then(function (images2) {
                wishlist.findAll({where:{user_id :req.user.name, bookid :booknumber}}).then(function (wishlist)  {


                    if(wishlist ==""){
            
                        res.render('viewbook', {
                            title: "Practical 5 Database Node JS - Edit Student Records",
                            images: images,
                            status: "Add to Wishlist?",
                            images2:images2,
                            wishlist:wishlist,
                            user : req.user,
                            comments: comments,
                            hostPath: req.protocol + "://" + req.get("host"),
                            urlPath: req.protocol + '://' + req.get('host') + req.originalUrl,
                    
                        })
                    }
                    else{
                    
                        res.render('viewbook', {
                            title: "Practical 5 Database Node JS - Edit Student Records",
                            images: images,
                            status:"Wishlisted",
                            images2:images2,
                            wishlist:wishlist,
                            user : req.user,
                            comments: comments,
                            hostPath: req.protocol + "://" + req.get("host"),
                            urlPath: req.protocol + '://' + req.get('host') + req.originalUrl,
                    
                        })
            
                    }
        
    })
    })
})
    .catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
});
});






router.post ('/', function (req, res){
    console.log("Creating comments")
  
    var commentData = {
        title: req.body.title,
        content: req.body.content,
        rating:req.body.rating,
        user_id: req.user.name
    }
    Comments.create(commentData).then((newComment, created) => {
        if (!newComment) {
            return res.send(400, {
                message: "error"
            });
        }
  
        res.redirect(req.get('referer'));
    })
  });

  router.delete ('/:id/:comments_id',function (req,res){
    var record_num = req.params.comments_id;
    console.log("deleting comments " + record_num);
    Comments.destroy({where: {id: record_num}}).then((deletedComment) => {
        if(!deletedComment){
            return res.send(400, {
                message: "error"
            });
        }

        res.status(200).send({message: "Deleted comments :" + record_num});
    })
});

module.exports = router;