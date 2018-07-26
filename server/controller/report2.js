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
    var reply = {

        add_count: 0,
        
    };
    
Reports.count( { where: { book_id: req.body.book_id } }).then(function(maxAddCount) {

        console.log(maxAddCount+"Min Min Min");
        if (maxAddCount == "" || isNaN(parseFloat(maxAddCount))) {
            reply.add_count = 1 ;
        }  
        else {
            reply.add_count = maxAddCount+1 ;
        }
        


        Reports.findAll()
        .then(report=>{
            res.render('reportitem',
            { 
             user : req.user,
             add_count : maxAddCount,
             report:report,
             urlPath: req.protocol + "://" + req.get("host") + req.url
            });
                   
Reports.findAll({where:{user_id :req.user.id, book_id :req.body.book_id}}).then(function (newReport) {


        if(newReport ==""){
            
            Reports.create(reportData).then((newReport, created) => {
                
                if (!newReport) {
                    return res.send(400, {
                        message: "error"
                    });
                }

               
            
       
         
            })
        }
        else{
      
        
            res.redirect('/products');

        }
        })
         
    })
    }
    )}

//     Reports.create(reportData).then((newReport, created) => {
//         if (!newReport) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }

//         res.redirect('/products');
//     })
// };


// exports.show = function(req,res){
//     Reports.findAll()
//     .then(report=>{
//    res.render('reportitem',
//     { 
//      user : req.user,
//      add_count : maxAddCount,
//      report:report,
//      urlPath: req.protocol + "://" + req.get("host") + req.url
//     });
//  });
// };


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




