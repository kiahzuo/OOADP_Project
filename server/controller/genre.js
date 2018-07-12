
var genre = require ('../models/genre');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;






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

        res.redirect('/profile');
    })
};