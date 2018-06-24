var express = require('express');
var router = express.Router();

var Bookitem = require('../server/models/models');
var Comments = require ('../server/models/comments');
var myDatabase = require('../server/controller/database');
var sequelize = myDatabase.sequelize;




router.get('/', function(req, res, next) {
    res.render('about', { title: 'Express',user : req.user, });
  });


//   router.get ('/' ,function(req, res){
//     sequelize.query('select c.id, c.title, c.content, u.email AS [user_id] from Comments c join Users u on c.user_id = u.id', {model: Comments}).then((comments) => {

//         res.render('about', {
//             comments: comments,
//             gravatar: gravatar.url(comments.user_id, {s: '80', r: 'x', d: 'retro'}, true),
//             urlPath: req.protocol + "://" + req.get("host") + req.url
//         })
//     }).catch((err)=>{
//         return res.status(400).send({
//             message: err
//         });
//     });
// });
module.exports = router;