var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Comments = require ('../server/models/comments');
var Images = require('../server/models/images');
var wishlist = require('../server/models/wishlist');
var Cart_Items = require('../server/models/cart');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op

var sequelize = myDatabase.sequelize;

// Retrieve update 1 by 1
router.get('/:id', function(req, res, next) {
    var booknumber = req.params.id;

    Images.findById(booknumber).then(function (images) {
        if(!images){
            res.redirect('/notfound');
        }
        else {
            Comments.findAll().then(function(comments){
                Images.findAll().then(function (images2) {
                    wishlist.findAll({where:{user_id :req.user.id, bookid :booknumber}}).then(function (wishlist)  {
                        Cart_Items.max('add_count', { where: { user_id: req.user.id } }).then(function(maxAddCount) {
    
                            console.log("Max add count:" + maxAddCount)

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
            })
    }
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