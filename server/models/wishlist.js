// models/comments.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const wishlist = sequelize.define('wishlist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    seller: {
        type: Sequelize.STRING,
     
    },
    bookid: {
        type: Sequelize.STRING,
        
     
    },
    user_id:{
        type: Sequelize.STRING,
      
    },

    imageName:{
        type: Sequelize.STRING,
      
    },

    price:{
        type: Sequelize.FLOAT,
      
    },
});

// force: true will drop the table if it already exists
wishlist.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("comments table synced");
});

module.exports = sequelize.model('wishlist', wishlist);