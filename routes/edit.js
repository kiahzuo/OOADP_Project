var express = require('express');
var router = express.Router();
var Bookitem = require('../server/models/models');
var Images = require('../server/models/images');

// Retrieve update 1 by 1
router.get('/:id', function(req, res, next) {
    var booknumber = req.params.id;
    Images.findById(booknumber).then(function (images) {
        res.render('edit', {
            title: "Practical 5 Database Node JS - Edit Student Records",
            images: images,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
});

router.post('/:id',function (req,res) {
    
    var booknumber = req.params.id;
    var updateData = {
        title : req.body.title,
        price1 : req.body.price,
        condition1 : req.body.condition,
        description1 : req.body.description,
        genre1: req.body.genre,
        meetup1 : req.body.meetup,
        avaliable : req.body.avaliable,
    }
    Images.update(updateData, { where: { id: booknumber } }).then((updatedRecord) => {
        if(!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated student record: " + booknumber });
        res.redirect("/profile")
    })
})



module.exports = router;


