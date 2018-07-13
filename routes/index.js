var express = require('express');
var router = express.Router();


var User = require("../server/models/users");
var nodemailer = require('nodemailer');
var crypto = require("crypto");

var myDatabase = require ('../server/controller/database');
var Sequelize = myDatabase.Sequelize;
const Op = Sequelize.Op

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('index', 
  { title: 'Express',
  user : req.user,


});
});


//forgot password
router.get('/forgot', function(req, res, next) {
  if(req.isAuthenticated()){
    res.redirect('/')
  }
  res.render('forgot', { title: 'Express' });
});

router.post('/forgot', function(req, res, next) {
  User.findOne({where:{email: req.body.email}}).then((user)=>{
    if (!user) {
      req.flash('error', 'No account with that email address exists.');
      return res.redirect('/forgot');
    }
    const buf = crypto.randomBytes(64);
    var token = buf.toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    user.save().then(()=>{
      var smtpTransport = nodemailer.createTransport({ 
        service: 'Gmail',
        auth: {
          user: 'jonsnow3050@gmail.com',
          pass: 'jonsnowisdead'
        }
      })
      var mailOptions = {
        to: user.email,
        from: 'jonsnow3050@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      smtpTransport.sendMail(mailOptions, function(err, info) {
        if(err) console.log(err);
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        res.redirect('/forgot')
      });
    })
  })
})

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {[Op.gt]: Date.now()}})
  .then((user)=>{
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {user: req.user});
  })
});

router.post('/reset/:token', function(req, res, next) {
  User.findOne({ where: {resetPasswordToken: req.params.token, 
  resetPasswordExpires: {[Op.gt]: Date.now()} } })
  .then((user)=>{
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    user.password = bcrypt.hashSync(req.body.password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    user.save().then((user)=>{
      var smtpTransport = nodemailer.createTransport({ 
       service: 'Gmail',
       auth: {
        user: 'jonsnow3050@gmail.com',
        pass: 'jonsnowisdead'
       }
      })
      var mailOptions = {
        to: user.email,
        from: 'jonsnow3050@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err, info) {
        if(err) console.log(err);
        req.login(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      });
    })
  })
})

module.exports = router;  