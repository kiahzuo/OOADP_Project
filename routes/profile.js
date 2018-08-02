var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');
var Reports = require ('../server/models/report');
var Images = require('../server/models/images');
var Comments = require ('../server/models/comments');
var Wishlist = require ('../server/models/wishlist');
var cartItems = require('../server/models/cart');
var fs = require('fs');
/* GET about page. */



router.delete('/:id',function (req,res) {

    var booknumber = req.params.id;
    var targetpath;



    Images.findById(booknumber).then((book)=>{
        targetpath ='./public/images/' + book.imageName;
        console.log(targetpath+'-------')
        fs.unlink(targetpath)

// 
    

// delete reports


          //Delete Image
          Images.destroy({ where: { id: booknumber } }).then((deletedRecord) => {

            if(!deletedRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            else{
                Comments.destroy({where: {title: booknumber}}).then((deletedComment) => {
                    if(!deletedComment){
                        return res.send(400, {
                            message: "error"
                        });
                    }
        
        
                    
            
                    res.status(200).send({message: "Deleted comments :" + booknumber});
                })


                Reports.destroy({ where: { book_id: booknumber } }).then((deletedRecord) => {
                    if(!deletedRecord) {
                        return res.send(400, {
                            message: "error"
                        });
                    }
                    res.status(200).send({ message: "Deleted student record: " + booknumber });
                });

                Wishlist.destroy({ where: { bookid: booknumber } }).then((deletedRecord) => {
                    if(!deletedRecord) {
                        return res.send(400, {
                            message: "error"
                        });
                    }
                    res.status(200).send({ message: "Deleted student record: " + booknumber });
                });

                cartItems.destroy({ where: { book_id: booknumber } }).then((deletedRecord) => {
                    if(!deletedRecord) {
                        return res.send(400, {
                            message: "error"
                        });
                    }
                    res.status(200).send({ message: "Deleted student record: " + booknumber });
                });
            }
       
            res.status(200).send({ message: "Deleted student record: " + booknumber });
        });

    })


      
    });


    // Images.findById(booknumber).then((book)=>{
    //     targetpath ='./public/images/'+book.imageName;
    //     book.destroy();
    // }).then(()=>{
    //             // remove from temp folder
    //             fs.unlink(targetpath,function(err){
    //                 if(err){
    //                     return res.status(500).send('Something bad happened here');
    //                 }
    //                 //redirect to gallery page
    //                 res.redirect('profile');
    //             });
    //     res.redirect('/products')
    // })





module.exports = router;