
var myDatabase = require ('../controllers/database')
var sequelizeInstance = myDatabase.sequelizeInstance;
var Sequelize = myDatabase.Sequelize;




const userModel = sequelizeInstance.define('chats', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sender: {
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'',
        trim: true
    },

    receiver: {
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'',
        trim: true
    },

    message: {
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'',
        trim: true
    }

});
//force true will drop the table if it already exists
userModel.sync ({ force: false, logging:console.log}).then(() => {
  //table created
  console.log('Chat Messages synced');

  userModel.upsert({
      id:1,
      sender:'Tom',
      receiver:'Jane',
      message:'Hello Friend'
    });

    userModel.upsert({
        id:2,
        sender:'Jane',
        receiver:'Tom',
        message:'Hello Friend!'
    });

    userModel.upsert({
        id:3,
        sender:'Jane',
        receiver:'Tom',
        message:'Hello!'
    });

    

});

module.exports = sequelizeInstance.model('chats',userModel)

