var express = require('express');
var router = express.Router();
var firebase = require('firebase');

/* GET bank page. */
router.get('/', function(req, res, next) {
  res.render('bank', { title: 'Express' });
});
module.exports = router;