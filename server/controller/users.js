

var Users = require ('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var sequelizeInstance = myDatabase.sequelizeInstance;



exports.show = function(req, res) {
    // List all Users and sort by Date

    Users.findAll()
    .then(users=>{ 
      res.render('usermanagement', { 
      title: 'Profile Page', 
      users:users,
      user : req.user, 
      urlPath: req.protocol + "://" + req.get("host") + req.url
      
      
    });})

    
   

};


exports.editRecord = function (req,res) {
    var record_num = req.params.id;
    Users.findById(record_num).then(function (users) {
        res.render('edituser', {
            users:users,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};


exports.update = function (req,res) {
    var record_num = req.params.id;
    var updateData = {
        role: req.body.roles,

    }
    Users.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if(!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/usermanagement')
    })
}


