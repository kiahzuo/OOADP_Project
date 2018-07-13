var profileTable = require("../models/users");
var myDatabase = require('../controller/database');
var sequelizeInstance = myDatabase.sequelizeInstance;
var Description = require('../models/description')


exports.insert = function (req,res) {
    var description = {
        desc_name: req.body.desc_name,
        desc_id: req.user.id
    }
    Description.create(description).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/profile');
    })
}

//list users from admin
exports.list = function (req,res) {
  profileTable.findAll({
        attributes: ['id', 'name', 'email']
    }).then(function (user) {
        res.render('profile', {
            title: "List of users",
            user: user,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};


//edit description
exports.editDescription = function (req,res) {
    var record_num = req.params.id;
    profileTable.findById(record_num).then(function (editDescription) {
        res.render('userlist', {
            title: "Edit Profile Description",
            item : editDescription,
            hostPath: req.protocol + "://" + req.get('host')
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//update description
exports.updateDescription = function (req,res) {
    var desc_num = req.params.desc_id;
    var updateData = {
        DescMsg: req.body.desc_name,
    }
    profileTable.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if(!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated profile description: " + desc_num });
    })
}

// Description.findOne({where:{descId: req.body.desc_id}})
