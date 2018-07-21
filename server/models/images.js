// models/images.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Images = sequelize.define('Images', {
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
    price: {
        type: Sequelize.DOUBLE
    },
    condition: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    meetup: {
        type: Sequelize.STRING
    },
    genre: {
        type: Sequelize.STRING
    },
    seller: {
        type: Sequelize.STRING
    },
    available: {
        type: Sequelize.STRING
    },
});

// force: true will drop the table if it already exists
Images.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("images table synced");
});

module.exports = sequelize.model('Images', Images);
