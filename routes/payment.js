var express = require('express');
var router = express.Router();
var myDatabase = require('../server/controller/database');

var Users = require('../server/models/users');
var sequelize = myDatabase.sequelize;
const Op = sequelize.Op

/* GET bank page. */
router.get('/', function(req, res, next) {
  res.render('payment', { 
      title: 'Rendering payment details for checkout',
      jsSendType: "Default",
      user : req.user,
      hostPath: req.protocol + "://" + req.get("host"),
      urlPath: req.protocol + '://' + req.get('host') + req.originalUrl, 
      // Extra
      paying: 99
    });
});

/* Render the page to register new bank account */
router.get('/new/', function(req, res, next) {
  // var user_id = req.params.uid;  --> Tried using URL parameter for "secruity", won't work normaly due to "trigger"

    res.render('registerCard', {
      title: "Registering new payment method...",
      jsSendType: "Register",
      user : req.user,
      hostPath: req.protocol + "://" + req.get("host"),
      urlPath: req.protocol + '://' + req.get('host') + req.originalUrl,
    })
});

/* Register the bank account for new users (For now is "required" upon signup) */
router.post("/new/:uid/", (req, res) => {
  console.log("new payment method route");
  if (req.userID == req.params.uid) {
    console.log("ID check successful")
  }

  Users.find({ where: { id: req.body.userID } }).then(function(updateRecord) {
        if (!updateRecord || updateRecord == 0) {
            return res.send(400, {
                message: "Error, user does not exist or unable to update"
            });
        } else {
            updateRecord.updateAttributes({
                bankCardNo: req.cardNumber,
                bankCardName: req.cardHolder
            });
            // reply.available = "In cart" --> Reference
            return res.send(200); // Need return?
        }
    });
});

module.exports = router;