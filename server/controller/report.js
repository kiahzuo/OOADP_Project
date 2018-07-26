var myDatabase = require('./database');
var Reports = require ('../models/report');
var Images = require('../models/images');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op





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
    
    // Reports.findAll({where:{ book_id :req.body.book_id}}).then(function (newReport) {
    //     if(newReport ==""){
            
    //         Reports.create(reportData).then((newReport, created) => {
    //             if (!newReport) {
    //                 return res.send(400, {
    //                     message: "error"
    //                 });
    //             }
                
    //             res.redirect('/products');
    //         })
    //     }
    //     else{
        
    //         res.redirect('/products');

    //     }
    //     })

        
    Reports.findAll({where:{user_id :req.user.id, book_id :req.body.book_id}}).then(function (newReport) {
        if(newReport ==""){
            
            Reports.create(reportData).then((newReport, created) => {
                if (!newReport) {
                    return res.send(400, {
                        message: "error"
                    });
                }
        
                res.redirect('/products');
            })
        }
        else{
        
            res.redirect('/products');

        }
        })
    }

//     Reports.create(reportData).then((newReport, created) => {
//         if (!newReport) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }

//         res.redirect('/products');
//     })
// };


exports.show = function(req,res){
    // FINDING "DISTINCT" REPORTS AND COUNTING DISTINCT INSTANCES - MKK code
    Images.findAll().then(function(bookIDs) {
        var bookIDArray = [];
        for (var i = 0; i < bookIDs.length; i++){
            bookIDArray.push(bookIDs[i].id);
        }
        console.log("Book IDs" + bookIDArray);
        Reports.findAll().then(reports=>{
        var reportedBookCountArray = [];
        for (var i = 0; i < bookIDArray.length; i++){
            var currentBookReportCount = 0;
            for (var j = 0; j < reports.length; j++){
               if (bookIDArray[i] == reports[j].book_id) {
                   currentBookReportCount += 1;
               }
            }
            if (currentBookReportCount != 0) {
                reportedBookCountArray.push(/*ToString(bookIDs[i]) + */currentBookReportCount);
            }
        }
        res.render('reportitem',
            { 
            add_counts : reportedBookCountArray,
            user : req.user,
            report:reports,
            urlPath: req.protocol + "://" + req.get("host") + req.url
            });
        }); 
        
    });
};


exports.delete = function (req,res) {
    var record_num = req.params.id;
    console.log("deleting" + record_num);
    Reports.destroy({ where: { id: record_num } }).then((deletedRecord) => {
        if(!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted student record: " + record_num });
    });
}




