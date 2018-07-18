var myDatabase = require('./database');
var Reports = require ('../models/report');
var sequelize = myDatabase.sequelize;






exports.create = function (req, res){
    console.log("Creating comments")

    var reportData = {
        title: req.body.title,
        content: req.body.reportcontent,
        user_id: req.user.id,
        reason: req.body.reason,
        seller:req.body.seller,
        book_id:req.body.book_id,

    }

    Reports.create(reportData).then((newReport, created) => {
        if (!newReport) {
            return res.send(400, {
                message: "error"
            });
        }

        res.redirect('/products');
    })
};


exports.show = function(req,res){
    Reports.findAll()
    .then(report=>{
   res.render('reportitem',
    { 
     user : req.user,
     report:report,
     urlPath: req.protocol + "://" + req.get("host") + req.url
    });
 });
};


// exports.delete = function(req,res){


//     var booknumber = req.params.id;
//     console.log("deleting" + booknumber);
//     Wishlist.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
//         if(!deletedRecord) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }
//         res.status(200).send({ message: "Deleted student record: " + booknumber });
//     });
  
// }


