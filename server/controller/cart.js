// Get cart model
var Cart_Items = require('../models/cart');
// Also get books (images) model
var Images = require('../models/images');


// Get/Import Database
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// List cart items - Not used?
exports.list = function(req, res){
    sequelize.query('SELECT c.id, c.add_Date, c.book_id, c.user_id, c.add_count, i.id AS [book_id], i.user_id AS [user_id], i.price1 AS [book_price] from Cart_Items c join Users u on c.book_id = i.id', {model: Cart_Items}).then((cart) => {

        res.render('cart', {
            title: 'Cart items',
            cart = Cart_Items,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err)=>{
        return res.status(400).send({
            message: err
        });
    });
};

exports.post ('/', function (req, res){
    console.log("Creating comments")
  
    var commentData = {
        title: req.body.title,
        content: req.body.content,
        rating:req.body.rating,
        user_id: req.user.name
    }
    Comments.create(commentData).then((newComment, created) => {
        if (!newComment) {
            return res.send(400, {
                message: "error"
            });
        }
  
        res.redirect(req.get('referer'));
    })
  });