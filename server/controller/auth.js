// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');
var Bookitem = require('../models/models');
var Images = require('../models/images');
var genre = require('../models/genre');
var profileTable = require("../models/users");
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
    Images.findAll()
  .then(images=>{ 

    profileTable.findAll({
        attributes: ['id', 'name', 'email']
    }).then(function (users) {
    genre.findAll()
    .then(genre=>{ 
      res.render('profile', { 
      title: 'Profile Page', 
      images:images,
      genre:genre,
      users: users,
      user : req.user, 
      avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true),
      urlPath: req.protocol + "://" + req.get("host") + req.url
      
      
    });})

})
   
})
};

exports.delete=(function (req,res) {
    var booknumber = req.params.id;
    var targetpath;


    console.log("deleting" + booknumber);
    Images.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
    
        if(!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        
        res.status(200).send({ message: "Deleted student record: " + booknumber });
    });
  }
  )

  
//   Images.findById(booknumber).then((book)=>{
//     targetpath ='./public/images/'+book.imageName;
//     fs.unlink(targetpath,function(err){
//       if(err){
//           return res.status(500).send('Something bad happened here');
//       }

//   });

// })

//   var booknumber = req.params.id;
//   var targetpath;

//   Images.findById(booknumber).then((book)=>{
//       targetpath ='./public/images/'+book.imageName;
//       book.destroy();
//   }).then(()=>{
// res.redirect('profile')

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
