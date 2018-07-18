var myDatabase = require("../controllers/database");
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const MsgModel = sequelizeInstance.define('message', {
    from: {
        type: Sequelize.STRING
    },
    to:{
        type: Sequelize.STRING
    },
    messages: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        //trim: true
    }
});

// force: true will drop the table if it already exists
MsgModel.sync({force: true, logging: console.log}).then(() =>{
    // Table created
    console.log("ChatMsgs table synced");
});

module.exports = sequelizeInstance.model('message', MsgModel);