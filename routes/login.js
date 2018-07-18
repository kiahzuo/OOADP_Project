var express = require('express');
var router = express.Router();
var passport = require('passport')
/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('login',{failure_message: req.flash('error')});
});

router.post("/", passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/profile',
  failureFlash: 'Username or password is incorrect!'
}));

module.exports = router;