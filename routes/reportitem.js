var express = require('express');
var router = express.Router();


var User = require("../server/models/users");
var nodemailer = require('nodemailer');
var crypto = require("crypto");

var myDatabase = require ('../server/controller/database');
var Sequelize = myDatabase.Sequelize;
const Op = Sequelize.Op

/* GET "home" page. */
router.get('/', function(req, res, next) {
  res.render('reportitem', 
  { title: 'Express',
  user : req.user,


});
});

module.exports = router;  