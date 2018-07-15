// models/cart.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;
//var sequelizeTransforms = require('sequelize-transforms');

const Transactions = sequelize.define('Transactions', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    checkout_Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Users',
        //     key: 'id'
        // }
    },
    seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Users',
        //     key: 'id'
        // }
    },
    book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Images',
        //     key: 'id'
        // }
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false  
    }
});

// force: true will drop the table if it already exists
Transactions.sync({ force: false, logging: console.log}).then(() => {
    console.log("Transactions table synced");
    // Test table creation with dummy data
    // return Transactions.upsert({
    //     id: 1,
    //     book_id: '1',
    //     user_id: '1',
    // })
});

module.exports = sequelize.model('Transactions', Transactions);

