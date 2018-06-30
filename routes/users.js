

var myDatabase = require('../server/controller/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});



module.exports = sequelize.model('Users', Users);

