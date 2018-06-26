// models/cart.js
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const cartItemsModel = sequelize.define('Cart_Items', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    add_Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Images',
            key: 'id'
        }
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    add_count:{
        type: Sequelize.INTEGER,
        allowNull = false
    }
});

// force: true will drop the table if it already exists
Images.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("Cart_Items table synced");
});

module.exports = sequelize.model('Cart_Items', cartItemsModel);