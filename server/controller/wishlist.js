var myDatabase = require('./database');
var Wishlist = require ('../models/wishlist');
var sequelize = myDatabase.sequelize;


exports.create = function (req, res){
    console.log("Adding Wishlist")

    var wishlistData = {
        title: req.body.title,
        seller: req.body.seller,
        bookid: req.body.bookid,
        user_id: req.user.name,

    }
    // wishlist.findAll({where:{user_id = user.name && bookid = }}).then(function (wishlist) {
    // wishlist.findall where user_id = logged user, item_id = item_id
    //.then((item)=>{
        //if item scold the fucker
        //else create
   // })

    Wishlist.create(wishlistData).then((newWishlist, created) => {
        if (!newWishlist) {
            return res.send(400, {
                message: "error"
            });
        }

        res.redirect('/about');
    })
};