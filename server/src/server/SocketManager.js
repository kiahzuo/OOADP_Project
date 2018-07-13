//backhand server
var userModel = require('../../models/userModel');
var myDatabase = require('../../controllers/database');
var sequelizeInstance = myDatabase.sequelizeInstance;

const io = require('./index.js').io
//importing stuff
const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
	LOGOUT, MESSAGE_RECIEVED, MESSAGE_SENT,
	TYPING, PRIVATE_MESSAGE } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

//a variable that has objects that has key value pairs of username and userid 
let connectedUsers = {}


module.exports = function (socket) {

	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser; //use that function to send msg 

	let sendTypingFromUser;

	//Verify Username
	//socket from module.exports
	//verify user is the event
	//connected user is the object
	socket.on(VERIFY_USER, (nickname, callback) => {
		if (isUser(connectedUsers, nickname)) { //isuser is a function
			callback({ isUser: true, user: null }) //use callback and send object
		} else {
			callback({ isUser: false, user: createUser({ name: nickname, socketId: socket.id }) }) // create new user inside factory
		}
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user) => { //takes a user object
		user.socketId = socket.id
		connectedUsers = addUser(connectedUsers, user) //the new user that you want to add in
		socket.user = user //set variable on socket

		sendMessageToChatFromUser = sendMessageToChat(user.name)
		sendTypingFromUser = sendTypingToChat(user.name)

		io.emit(USER_CONNECTED, connectedUsers)
		console.log(connectedUsers);

	})

	//User disconnects
	socket.on('disconnect', () => { //whenever this person disconnects 
		if ("user" in socket) { //check if user is in the socket
			connectedUsers = removeUser(connectedUsers, socket.user.name)
			//otherwise dont do anything

			//emit disconnected users 
			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})


	//User logs out
	socket.on(LOGOUT, () => {
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

	})



	socket.on(MESSAGE_SENT, ({ chatId, message}) => { //when user sends msg get chatid and msg	
		sendMessageToChatFromUser(chatId, message)
		console.log("chat id is "+chatId);
		var chatData = {

			message: message
		}
		userModel.create(chatData).then((newRecord, created) => {
			if(!newRecord){
				console.log("chat message not saved to DB");
			}			
		})

	})

	socket.on(TYPING, ({ chatId, isTyping }) => {
		sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE,({ reciever, sender,chatId, message }) => {
		sendMessageToChatFromUser(chatId, message)
		if (reciever in connectedUsers) {
			const newChat = createChat({ name: `${reciever}&${sender}`, users: [reciever, sender] })
			const recieverSocket = connectedUsers[reciever].socketId
			socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
			socket.emit(PRIVATE_MESSAGE, newChat)
		}
		var chatData = {
			sender: sender,
			receiver: reciever,
			message:message
			
		}
		userModel.create(chatData).then((newRecord, created) => {
			if(!newRecord){
				console.log("chat message not saved to DB");
			}			
		})
		// exports.insert = function (req,res){
		// 	var chatData = {
		// 		// userid: req.body.userid,
		// 		sender: req.body.sender,
		// 		receiver: req.body.receiver,
		// 		message: req.body.message
		// 	}
		// 	userModel.create(chatData).then((newRecord, created) => {
		// 		if(!newRecord){
		// 			return res.send(400, {
		// 				message:"error"
		// 			});
		// 		}
		// 		res.redirect('/');
		// 	})
		// 	};
	 })
}

// Returns a function that will take a chat id and a boolean isTyping
// and then emit a broadcast to the chat id that the sender is typing
function sendTypingToChat(user) {
	return (chatId, isTyping) => { //returns and chat istyping variable 
		io.emit(`${TYPING}-${chatId}`, { user, isTyping })
	}
}


// Returns a function that will take a chat id and message
//and then emit that a msg was sent to a chat
function sendMessageToChat(sender) { //takes in a sender
	return (chatId, message) => { //afunction that takes a chat id and msg
		//emit the event that the chat needs to emit to the client 
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({ message, sender }))//emit event chat needs to receive 
	}
}

// Adds user to list passed in.

function addUser(userList, user) {
	let newList = Object.assign({}, userList) //object w the users in the list
	newList[user.name] = user //add new user
	return newList
}


// Removes user from the list passed in.

function removeUser(userList, username) {
	let newList = Object.assign({}, userList) //object w key value pairs
	delete newList[username] // name of the user that needs to be removed
	return newList //new object w key value pair
}


// Checks if the user is in list passed in.
// return if true
function isUser(userList, username) {
	return username in userList
}

