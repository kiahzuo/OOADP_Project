var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');
var Images = require('../server/models/images');
var fs = require('fs');
/* GET about page. */



router.delete('/:id',function (req,res) {

    var booknumber = req.params.id;
    var targetpath;



    Images.findById(booknumber).then((book)=>{
        targetpath ='./public/images/' + book.imageName;
        console.log(targetpath+'-------')
        fs.unlink(targetpath)

          //Delete Image
          Images.destroy({ where: { id: booknumber } }).then((deletedRecord) => {

            if(!deletedRecord) {
                return res.send(400, {
                    message: "error"
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