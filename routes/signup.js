var express = require('express');
var router = express.Router();


/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express',
  user : req.user, });
});

// router.post('/')
//   var name = req.body.name
//   var email = req.body.email
//   var password = req.body.password

module.exports = router;