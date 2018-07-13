var userModel = require('../../models/userModel');
var myDatabase = require('./database');
var sequelizeInstance = myDatabase.sequelizeInstance;


//list all the chat records in database
exports.list = function (req,res){
    userModel.findAll({
        attributes: ['id','sender','receiver','message']
    }).then(function (chat){
        res.render('index',{
            urlPath: req.protocol  +"://" + req.get("host") + req.url
        });
    }).catch((err)=>{
        return res.status(400).send({
            message:err
        });
    });
};

// //update chat record in database
// exports.update = function (req,res){
//     var updateData = {
//         name:req.body.name,
//         chat:req.body.name
//     }
//     userModel.update(updateData, {where: {id: record_num} }).then((updateRecord) => {
//         if (!updateRecord || updatedRecord == 0 ) {
//             return res.send(400,{
//                 message:'error'
//             });
//         }
//         res.status(200).send({message:"Updated chat record:"+ record_num});
//     })
// }