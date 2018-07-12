// Import modules
var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');

//set image file types
var IMAGE_TYPES = ['image/jpeg','image/jpg','image/png'];

var Images = require('../models/images');
var genre = require('../models/genre');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


//show edit
// exports.showproducts = function(req,res){
//     Images.findAll()
//     .then(images=>{

//         Users.findAll()
//      .then(users=>{

//      res.render('products', {
//         images: images,
//           users:users,
//          user : req.user,});
  
//     });
//   });
// };

exports.updateImage = function(req,res){
    var src;
    var dest;
    var targetPath;
    var targetName;

    try{
        var tempPath = req.file.path;
        //get the mmime type of the file
        var type = mime.lookup(req.file.mimetype);
        // get file extension
        var extension = req.file.path.split(/[. ]+/).pop();
        // check support file types
        if (IMAGE_TYPES.indexOf(type) == -1) {
            return res.status(415).send('Support images formats: jpeg, jpg, jpe, png.');
    
        }
        // Set new path to images
        targetPath = './public/images/' + req.file.originalname;
        // using read stream API to read file
        src = fs.createReadStream(tempPath);
        // using a write stream API to write file
        dest = fs.createWriteStream(targetPath);
        src.pipe(dest);
        // Show error
        src.on('error', function (err) {
            if (err) {
                return res.status(500).send({
                    message: error
                });
            }
        });
    
        var booknumber = req.params.id;
        var updateData = {
            title : req.body.title,
            price1 : req.body.price,
            condition1 : req.body.condition,
            description1 : req.body.description,
            genre1: req.body.genre,
            meetup1 : req.body.meetup,
            avaliable : req.body.avaliable,
            imageName:req.file.originalname,
          
        }
        Images.update(updateData, { where: { id: booknumber } }).then((updatedRecord) => {
            if(!updatedRecord || updatedRecord == 0) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect("http://localhost:3000/profile")
        })
    }
    catch(err){

        var booknumber = req.params.id;
        var updateData = {
        title : req.body.title,
        price1 : req.body.price,
        condition1 : req.body.condition,
        description1 : req.body.description,
        genre1: req.body.genre,
        meetup1 : req.body.meetup,
        avaliable : req.body.avaliable,
    }
    Images.update(updateData, { where: { id: booknumber } }).then((updatedRecord) => {
        if(!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }

        res.redirect("http://localhost:3000/profile")
    })



    }
    

}


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

// on products page
exports.filterCategories =function(req, res) {
    var category = req.body.sort;
    if(category == "All")
    {
        genre.findAll()
        .then(genre=>{
            
          Images.findAll()
          .then(images=>{
              
            res.render('products',{
                images:images,
                genre:genre,
            
            })
          })
        })
      }


      else if(category == "low")
    {

        genre.findAll()
        .then(genre=>{
            
        Images.findAll({order: [['price1', 'asc']]})
        .then(images=>{
            res.render('products', {
                images:images,
                genre:genre,
              })    
    })
})
      }


      else if(category == "high")
    {

        genre.findAll()
        .then(genre=>{
            
        Images.findAll({order: [['price1', 'DESC']]})
        .then(images=>{
            res.render('products', {
                images:images,
                genre:genre,
              })
    })
})
      }






    else{

        genre.findAll()
    .then(genre=>{
        
      Images.findAll({where:{genre1:category}})
      .then(images=>{
          
        res.render('products',{
            images:images,
            genre:genre,
        
        })
      })
    })
  
    }
  
    }

// on viewprofile page

exports.filterCategories2 =function(req, res) {
    var category = req.body.sort;
    if(category == "All")
    {
        genre.findAll()
        .then(genre=>{
            
          Images.findAll()
          .then(images=>{
              
            res.render('profile',{
                images:images,
                genre:genre,
            
            })
          })
        })
      }


      else if(category == "low")
    {

        genre.findAll()
        .then(genre=>{
            
        Images.findAll({order: [['price1', 'asc']]})
        .then(images=>{
            res.render('profile', {
                images:images,
                genre:genre,
              })    
    })
})
      }


      else if(category == "high")
    {

        genre.findAll()
        .then(genre=>{
            
        Images.findAll({order: [['price1', 'DESC']]})
        .then(images=>{
            res.render('profile', {
                images:images,
                genre:genre,
              })
    })
})
      }






    else{

        genre.findAll()
    .then(genre=>{
        
      Images.findAll({where:{genre1:category}})
      .then(images=>{
          
        res.render('profile',{
            images:images,
            genre:genre,
        
        })
      })
    })
  
    }
}

    //show edit
exports.show = function(req,res){

    genre.findAll()
    .then(genre=>{
    var booknumber = req.params.id;
    Images.findById(booknumber).then(function (images) {
        res.render('edit', {
            title: "Practical 5 Database Node JS - Edit Student Records",
            images: images,
            genre:genre,
            hostPath: req.protocol + "://" + req.get("host"),
            urlPath: req.protocol + "://" + req.get("host") + req.url
            
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    })
    });
};
