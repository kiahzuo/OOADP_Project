// Variables for modules
var express = require('express');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var router = express.Router();
var firebase = require('firebase');
var app = express();
var expressValidator = require('express-validator');
var msg = require('./server/models/chatmsg');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var onlineUsers = [];
// Including neccessary "modules"...
app.use(logger('dev'));
// app.use(bodyParser.json()); // Updated Express, can just use express.json()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
// View engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//import multer
var multer = require('multer');
var upload = multer({dest:'./public/uploads/',limits:{fileSize: 1500000, files:2} });
// firebase (for payment)
var config = {
    apiKey: "AIzaSyBcI54P-yTiaNAXEDASZGH3eJNkcbXY7wE",
    authDomain: "ooadp-2018-sem1-e409b.firebaseapp.com",
    databaseURL: "https://ooadp-2018-sem1-e409b.firebaseio.com",
    projectId: "ooadp-2018-sem1-e409b",
    storageBucket: "ooadp-2018-sem1-e409b.appspot.com",
    messagingSenderId: "1025088843498"
  };
firebase.initializeApp(config);
var database = firebase.database().ref();

// Import login controller
var auth = require('./server/controller/auth');
//Import images controller
var images = require('./server/controller/images');
//Import genre controller
var genre = require('./server/controller/genre');
//Import wishlist
var wishlist = require('./server/controller/wishlist');
//Import comments controller
var comments = require('./server/controller/comments');
//Import transaction controller (file)
var transaction = require('./server/controller/transaction');
//Import report controller
var report = require('./server/controller/report');
//Import users controller
var users = require('./server/controller/users');

// Modules to store session
var myDatabase = require('./server/controller/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});

// Import Passport and Warning flash modules
var passport = require('passport');
// var flash = require('connect-flash');
var flash = require('express-flash');
// Passport configuration
require('./server/config/passport')(passport);
// secret for session
app.use(expressSession({
    secret: 'sometextgohere',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));
// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());
//User session
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

/* RAW HTTP REQUEST HANDLERS (Entire section below) */
// Login routes, get and post
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));
// Signup routes, get  and post
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect: '/payment/new/',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Delete function rotes for items, get and delete
app.get('/profile', auth.isLoggedIn, auth.profile);
app.delete("/profile", auth.delete);

// Logout page routes, get
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});
//editing user
app.get("/usermanagement",users.show)
app.get("/edituser/:id",users.editRecord)
app.post("/edituser/:id", users.update);


//adding report
app.get('/indepth/:id',report.indepthshow)
app.post('/report',report.create)
app.get('/reportitem',report.show)
app.delete('/indepth/:id',report.delete)
// app.delete('/reportitem/:id',report.delete)
// Book edit HTTP request handlers
app.post("/edit/:id", upload.single('imageName'),images.updateImage)
app.get("/edit/:id", images.show);
// adding new genre
app.get('/genre',genre.show)
app.post('/genre', genre.create)
app.delete('/genre/:id',genre.delete)
// wishlist HTTP request handlers
app.get('/wishlist', auth.isLoggedIn,wishlist.show)
app.delete('/wishlist/:id',wishlist.delete, auth.isLoggedIn)
app.post('/viewbook1', wishlist.create)
app.post('/store', images.hasAuthorization, upload.single('image'), images.uploadImage);
// Filter price "range" on products page 
app.post('/filterprice', images.filterPrice)
//Render the cart on "every page?"  --> Doesn't work on index "/" route
// app.get('/', function(req, res, next) {
     
//     res.render('../partials/cart', {
//         user : req.user
//     });
// });  
   
 
/* END RAW ROUTES */

// Routers' routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var storeRouter = require('./routes/store');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var signupRouter = require('./routes/signup');
var editRouter = require('./routes/edit');
var viewbookRouter = require('./routes/viewbook');
var viewprofileRouter = require('./routes/viewprofile');
var transactionRouter = require('./routes/transaction');
var paymentRouter = require('./routes/payment');
var bankRouter = require('./routes/bank');
var notfoundRouter = require('./routes/notfound');
var reportitemRouter = require('./routes/reportitem');
var chatRouter = require('./routes/chat');
var changeRouter = require('./routes/updatepw')
// Assigning routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter, images.filterCategories );
app.use('/store', auth.isLoggedIn, storeRouter,images.hasAuthorization, upload.single('image'), images.uploadImage);
app.use('/login',loginRouter);
app.use('/profile', profileRouter, images.filterCategories2);
app.use('/signup',signupRouter);
app.use('/viewbook', auth.isLoggedIn,viewbookRouter,wishlist.create);
app.use('/viewprofile',viewprofileRouter );
app.use('/transaction', transactionRouter);
app.use('/bank', bankRouter);
app.use('/payment', paymentRouter);
app.use('/edit', editRouter);
app.use('/notfound', notfoundRouter);
app.use('/reportitem', reportitemRouter);
app.use('/change', changeRouter);
app.use('/chat',chatRouter);



//IFFAH

io.on('connection', function(socket) {

    //   console.log('a user connected');

    socket.on('user name', function(user, callback) {
        var temp = 0;
        onlineUsers.push({
            profileName: user.userName,
            profileId: socket.id,
            counter: temp
        })

        // console.log(userName);
        console.log(onlineUsers);

        io.sockets.emit('connectedUsers', onlineUsers);

    });

    socket.on('disconnect', function() {
        var i = 0;
        while (i < onlineUsers.length) {
            if (onlineUsers[i].profileId == socket.id) {
                break;
            }
            i++;
        }
        console.log(socket.id + 'disconnect');

        onlineUsers.splice(i, 1);
        io.sockets.emit('connectedUsers', onlineUsers);
        //console.log('user disconnected');
    });

    socket.on('chatting', function(message, sender,receiver,receivername) {
    
        //save msg to database
        var msgDataJSON = {
         sender: sender.userName,
         receivername: receivername,
         messages: message
       }
       console.log("received msg: "+ JSON.stringify(receivername));
       msg.create(msgDataJSON).then((newMessage) =>{
           if(newMessage){
               //successfully saved to database
               socket.to(receiver).emit('reciverPeer', message, socket.id, receiver); // send to other person           
           }
           
           socket.emit('senderPeer', message, socket.id, receiver); //send to yourself?
       });
 
       //send msgs by socket io to the person
       //socket.to(receiver).emit('reciverPeer', message, socket.id, receiver);
      // socket.emit('senderPeer', message, socket.id, receiver);      
   })
});
// Render special "page" for when logged out (user session variable undefined)?

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//  app.listen(3000);
app.listen(3000);
//  module.exports = app;