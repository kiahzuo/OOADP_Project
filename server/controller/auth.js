// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');
var Bookitem = require('../models/models');

// Signin GET
exports.signin = function(req, res) {
    // List all Users and sort by Date
    res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
};
// Signup GET
exports.signup = function(req, res) {
    // List all Users and sort by Date
    res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });

};
// Profile GET
exports.profile = function(req, res) {
    // List all Users and sort by Date
    Bookitem.findAll()
  .then(retrievebook=>{ res.render('profile', { title: 'Profile Page', retrievebook:retrievebook, user : req.user, avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true) });})
   
};
// Logout function
exports.logout = function () {
    req.logout();
    res.redirect('/');
};

// check if user is logged in
exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};