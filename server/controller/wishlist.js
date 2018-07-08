var myDatabase = require('./database');
var Wishlist = require ('../models/wishlist');
var sequelize = myDatabase.sequelize;



exports.show = function(req,res){
    Wishlist.findAll()
    .then(wishlist=>{
   res.render('wishlist',
    { wishlist: wishlist,
     user : req.user,
     urlPath: req.protocol + "://" + req.get("host") + req.url
    });
 });
};


exports.delete = function(req,res){


    var booknumber = req.params.id;
    console.log("deleting" + booknumber);
    Wishlist.destroy({ where: { id: booknumber } }).then((deletedRecord) => {
        if(!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted student record: " + booknumber });
    });
  
}


exports.create = function (req, res){
    console.log("Adding Wishlist")
    


    var wishlistData = {
        title: req.body.title,
        seller: req.body.seller,
        bookid: req.body.bookid,
        bookimage:req.body.bookimage,
        user_id: req.user.name,
        
        

    }
        Wishlist.findAll({where:{user_id :req.user.name, bookid :req.body.bookid}}).then(function (wishlist) {
        if(wishlist ==""){
            
            Wishlist.create(wishlistData).then((newWishlist, created) => {
                if (!newWishlist) {
                    return res.send(400, {
                        message: "error"
                    });
                }
    
               
        
                res.redirect('/wishlist');
            })
        }
        else{
        
            res.redirect('/wishlist');

        }
        })
  

    

};