var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


router.get('/test', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
module.exports = router;