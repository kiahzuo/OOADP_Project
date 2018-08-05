// models/users.js

var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var passwordadmin = bcrypt.hashSync('1234', salt);

var myDatabase = require('../controller/database');
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
    },
    resetPasswordToken:{
        type: Sequelize.STRING,
    },
    resetPasswordExpires: {
        type: Sequelize.DATE,
    },
    designatedBankAccount: {
        type: Sequelize.STRING, // Testing...
        allowNull: true
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "USER",
    },
});

// force: true will drop the table if it already exists
Users.sync({force: false, logging:console.log}).then(()=>{
    console.log("users table synced");
    return Users.upsert({
        id: 1,
        name: 'ADMIN',
        email: 'a@b.com',
        password: passwordadmin,
        role: 'SUPERADMIN',
    })
});

module.exports = sequelize.model('Users', Users);
module.exports.bcrypt = bcrypt;
module.exports.salt = salt;