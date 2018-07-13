
var genre = require ('../models/genre');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var sequelizeInstance = myDatabase.sequelizeInstance;

exports.show = function(req, res) {
    // List all Users and sort by Date

    genre.findAll()
    .then(genre=>{ 
      res.render('genre', { 
      title: 'Profile Page', 
      genre:genre,
      user : req.user, 
      urlPath: req.protocol + "://" + req.get("host") + req.url
      
      
    });})

    
   

};




exports.create = function (req, res){


    var genreData = {
        genre: req.body.genre,

    }

    genre.create(genreData).then((newGenre, created) => {
        if (!newGenre) {
            return res.send(400, {
                message: "error"
            });
        }

        res.redirect('/genre');
    })
};


exports.delete = function (req,res) {
    var genre_num = req.params.id;
    console.log("deleting" + genre_num);
    genre.destroy({ where: { id: genre_num } }).then((genreRecord) => {
        if(!genreRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted genre record: " + genre_num });
    });
}