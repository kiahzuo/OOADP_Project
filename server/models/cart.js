// models/cart.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;
//var sequelizeTransforms = require('sequelize-transforms');

const Cart_Items = sequelize.define('Cart_Items', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    add_Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Images',
        //     key: 'id'
        // }
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Users',
        //     key: 'id'
        // }
    },
    add_count:{
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

// force: true will drop the table if it already exists
Cart_Items.sync({ force: true, logging: console.log}).then(() => {
    console.log("Cart_Items table synced");
    // Test table creation with dummy data
    // return Cart_Items.upsert({
    //     id: 1,
    //     book_id: '1',
    //     user_id: '1',
    // })
});

module.exports = sequelize.model('Cart_Items', Cart_Items);

