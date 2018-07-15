// models/cart.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;
//var sequelizeTransforms = require('sequelize-transforms');

const Payments = sequelize.define('Payments', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    payment_Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    // Since all payments will be between BookTrade bank account and a certain user (whether buyer or seller), only need to explictly store user details
    user_id: { 
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    user_bank_account_number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // This will decide/show which part of the transaction the payment is for
    /* E.g. "checkout"/"1" means the 100% of book(s) cost going to from buyer to BookTrade account, "2" means the first 47.5% going to each seller, "3" means the final paymen to the seller(s) */
    payment_type: {     
        type: Sequelize.STRING, 
        allowNull: false
    },
    transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    money_amount: {
        type: Sequelize.FLOAT,
        allowNull: false  
    }
});

// force: true will drop the table if it already exists
Payments.sync({ force: false, logging: console.log}).then(() => {
    console.log("Payments table synced");
    // Test table creation with dummy data
    // return Payments.upsert({
    //     id: 1,
    //     book_id: '1',
    //     user_id: '1',
    // })
});

module.exports = sequelize.model('Payments', Payments);

