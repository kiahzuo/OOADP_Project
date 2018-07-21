var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');
var Images = require('../server/models/images');

// Retrieve update 1 by 1
// router.get('/:id', function(req, res, next) {
//     var booknumber = req.params.id;
//     Images.findById(booknumber).then(function (images) {
//         res.render('edit', {
//             title: "Practical 5 Database Node JS - Edit Student Records",
//             images: images,
//             hostPath: req.protocol + "://" + req.get("host"),
//             urlPath: req.protocol + "://" + req.get("host") + req.url
            
//         });
//     }).catch((err) => {
//         return res.status(400).send({
//             message: err
//         });
//     });
// });

// router.post('/:id',function (req,res) {
//     var src; 
// var dest;
// var targetPath;
// var targetName;
// var tempPath = req.file.path;
// var booknumber = req.params.id;
// console.log(req.file);

// //get the mime type of the file
// var type = mime.lookup(req.file.mimetype);

// //get file extension
// var extension = req.file.path.split(/[. ]+/).pop();

// // check support file types
// if(IMAGE_TYPES.indexOf(type) == -1)
// {
//     return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png.');
// }

// // set new path to images
// targetPath = './public/images/' + req.file.originalname;

// // using read stream API to read file
// src = fs.createReadStream(tempPath);    //where you want to read it from

// // using read stream API to write file
// dest = fs.createWriteStream(targetPath);        //where you want it to be saved at
// src.pipe(dest);

// //show error
// src.on('error', function(err){
//     if(err) {
//         return res.status(500).send({
//             message: error
//         });
//     }
// });
    

//     var updateData = {
//         title : req.body.title,
//         price : req.body.price,
//         condition1 : req.body.condition,
//         description1 : req.body.description,
//         genre1: req.body.genre,
//         meetup1 : req.body.meetup,
//         available : req.body.available,
//         imageName: req.file.originalname,
//     }
//     Images.update(updateData, { where: { id: booknumber } }).then((updatedRecord) => {
//         if(!updatedRecord || updatedRecord == 0) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }
//         res.status(200).send({ message: "Updated student record: " + booknumber });
//         res.redirect("/profile")
//     })
// })




// router.post('/:id',function (req,res) {
    
//     var booknumber = req.params.id;
//     var updateData = {
//         title : req.body.title,
//         price : req.body.price,
//         condition1 : req.body.condition,
//         description1 : req.body.description,
//         genre1: req.body.genre,
//         meetup1 : req.body.meetup,
//         available : req.body.available,
//     }
//     Images.update(updateData, { where: { id: booknumber } }).then((updatedRecord) => {
//         if(!updatedRecord || updatedRecord == 0) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }
//         res.status(200).send({ message: "Updated student record: " + booknumber });
//         res.redirect("backURL")
//     })
// })



module.exports = router;


