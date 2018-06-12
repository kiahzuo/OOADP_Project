var express = require('express');
var router = express.Router();
var gravatar = require ('gravatar');
var Bookitem = require('../server/models/models');
var Comments = require ('../server/models/comments');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('viewbook', { title: 'Express' });
});



// Retrieve update 1 by 1
router.get('/:id', function(req, res, next) {
    var booknumber = req.params.id;
    Bookitem.findById(booknumber).then(function (retrievebook) {
        res.render('viewbook', {
            title: "Practical 5 Database Node JS - Edit Student Records",
            retrievebook: retrievebook,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
});



module.exports = router;