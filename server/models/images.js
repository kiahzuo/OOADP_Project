// models/images.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Books = sequelize.define('Books', {
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
    imageName: {
        type: Sequelize.STRING
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    price1: {
        type: Sequelize.INTEGER
    },
    condition1: {
        type: Sequelize.STRING
    },
    description1: {
        type: Sequelize.STRING
    },
    meetup1: {
        type: Sequelize.STRING
    },
    genre1: {
        type: Sequelize.STRING
    },
    seller: {
        type: Sequelize.STRING
    },
    avaliable: {
        type: Sequelize.STRING
    },
});

// force: true will drop the table if it already exists
Books.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("images table synced");
});

module.exports = sequelize.model('Books', Books);
