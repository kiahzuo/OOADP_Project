// models/cart.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;
//var sequelizeTransforms = require('sequelize-transforms');

const Payment_Cards = sequelize.define('Payment_Cards', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cardNo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cardType: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bankAccountNo: {  
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {  
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// force: true will drop the table if it already exists
Payment_Cards.sync({ force: false, logging: console.log}).then(() => {
    console.log("Payment_Cards table synced");
    // Test table creation with dummy data
    // return Payment_Cards.upsert({
    //     id: 1,
    //     book_id: '1',
    //     user_id: '1',
    // })
});

module.exports = sequelize.model('Payment_Cards', Payment_Cards);

