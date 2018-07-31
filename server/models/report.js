// models/comments.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Reports = sequelize.define('Reports', {
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
    book_id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    seller:{
        type: Sequelize.STRING,
      
    },  
    content: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    user_id:{
        type: Sequelize.STRING,
      
    },

    reason:{
        type: Sequelize.STRING,
      
    },

});

// force: true will drop the table if it already exists
Reports.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("comments table synced");
});

module.exports = sequelize.model('Reports', Reports);