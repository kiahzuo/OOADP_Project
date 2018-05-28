
var myDatabase = require('../controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;
var sequelizeTransforms = require('sequelize-transforms');


const Bookitem = sequelize.define('Bookitem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookname1: {
        type: Sequelize.STRING
    },
    price1: {
        type: Sequelize.STRING
    },
    condition1: {
        type: Sequelize.STRING
    },
    description1: {
        type: Sequelize.STRING
    },
    meetup1: {
        type: Sequelize.STRING
    }
});

sequelize.sync({ force: true, logging: console.log}).then(() => {
    // Table created
    console.log("books table synced");
});

module.exports = sequelize.model('Bookitem', Bookitem);
