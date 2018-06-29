// Import modules
var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');

//set image file types
var IMAGE_TYPES = ['image/jpeg','image/jpg','image/png'];

var Images = require('../models/images');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

//show images gallery
exports.show = function(req,res){
    Images.findAll()
    .then(images=>{
        res.render('store',{       //render the images-gallery.ejs file
            images: images,
            gravatar:gravatar.url(images.user_id,{s:'80',r:'x',d:'retro'}, true)
        });
    }).catch((err) => {
        return res.status(400).send({
            message:err
        });
    });
};

//Image upload
exports.uploadImage = function(req,res){
    var src; 
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log(req.file);

    //get the mime type of the file
    var type = mime.lookup(req.file.mimetype);

    //get file extension
    var extension = req.file.path.split(/[. ]+/).pop();

    // check support file types
    if(IMAGE_TYPES.indexOf(type) == -1)
    {
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png.');
    }

    // set new path to images
    targetPath = './public/images/' + req.file.originalname;

    // using read stream API to read file
    src = fs.createReadStream(tempPath);    //where you want to read it from

    // using read stream API to write file
    dest = fs.createWriteStream(targetPath);        //where you want it to be saved at
    src.pipe(dest);

    //show error
    src.on('error', function(err){
        if(err) {
            return res.status(500).send({
                message: error
            });
        }
    });

    // save file process
    src.on('end', function(){       //only happens when it has been saved into the database
        //create new instance of the images model with request body
        var imageData = {
            title: req.body.title,
            imageName: req.file.originalname,
            user_id: req.user.id,
            price1:req.body.price,
            condition1:req.body.condition,
            description1 : req.body.description,
            genre1 : req.body.genre,
            meetup1 : req.body.meetup,
            seller: req.user.name,
            avaliable:req.body.avaliable,
        

        }

        //save to database
        Images.create(imageData).then((newImage, created) =>{
            if(!newImage)
            {
                return res.send(400, {
                    message: error
                });
            }
            res.redirect('profile');
        })

        //remove from temp folder
        fs.unlink(tempPath,function(err){
            if(err){
                return res.status(500).send('Something bad happened here');
            }
            //redirect to gallery page
            res.redirect('profile');
        });
    });
};

//images authorization middleware
exports.hasAuthorization = function(req,res,next)
{
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}


exports.filterCategories =function(req, res) {
    var category = req.body.category;
    if(category == "All")
    {
      Images.findAll()
        .then(images =>{
          res.render('products', {
            images:images,
          })
        })
      }
    else{
      Images.findAll({where:{genre1:category}})
      .then(images=>{
        res.render('products',{images:images})
      })
    }
  
    }


    exports.filterPriceSorting = function(req,res){
        var pricesort = req.body.pricesort;
        if(pricesort == "low")
        {
            Images.findAll({order: [['price1', 'ASC']]})
                .then(images=>{
                    res.render('products', {
                        images:images,
                      })
            })
           
        }

        else {
            Images.findAll({order: [['price1', 'DESC']]})
            .then(images=>{
                res.render('products', {
                    images:images,
                  })
            })
            
        }



    }