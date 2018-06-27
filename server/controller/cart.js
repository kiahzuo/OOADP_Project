// Get cart model
var cartItems = require('../models/cart');
// Also get books (images) model
var Images = require('../models/images');

// Get/Import Database
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// List cart items
exports.list = function(req, res){
    sequelize.query('SELECT c.id, c.add_Date, c.book_id, c.user_id, c.add_count, i.id AS [book_id], i.user_id AS [user_id], i.price1 AS [book_price] from Cart_Items c join Users u on c.book_id = i.id', {model: cartItems}).then((cart) => {

        res.render('cart', {
            title: 'Cart items',
            cart = cartItems,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err)=>{
        return res.status(400).send({
            message: err
        });
    });
};

// Create cart items
exports.create = function (req, res){
    console.log("Adding to cart")

    var cartItemData = {
        item_id: req.body.id,
        add_Date: req.body.add_Date,
        add_count: req.body.add_count,
        book_id: req.body.book_id,
        user_id: req.body.user_id,
        book_price: req.body.book_price
    }

    cartItems.create(cartItemData.then((newCartIte, created) => {
        if (!newComment) {
            return res.send(400, {
                message: "error"
            });
        }

        res.redirect('/products');
    })
};