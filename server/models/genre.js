// models/comments.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const genre = sequelize.define('genre', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    genre: {
        type: Sequelize.STRING,
     
    },
    
});

// force: true will drop the table if it already exists
genre.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("genre table synced");
});

module.exports = sequelize.model('genre', genre);