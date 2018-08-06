//render function for Name start here //
var socket = io();
//var socket = io.connect('http://localhost:3001');
var ownId;
var receiverId;
var recieverName;
var reciverImage;
var messages = [];
var imageUrl;
var notify = [];
var activeDiv;
var user = {};
var numbers = /^[-+]?[0-9]+$/;

makeTemplates();


// avataar container start here

bind('.mainContainer .loginSection .userInfo .userProfileImg', function() {
    $('.realBoxSection').fadeOut('slow');
    $('.avatarContainer').fadeIn('slow');
})
bind('.avatar', function() {
    $('.realBoxSection').show();
    user.imageUrl = $(this).attr('src');
    console.log('image url    ', user.imageUrl)
    $('.userInfo .userProfileImg').html('<img src="' + user.imageUrl + '" class="userImage">');
    $('.avatarContainer').fadeOut('slow');

})

// avataar container closed here




//multiple screens render start here

function update(req) {
    localUser = req;
}

var loginScreen1 = new function() {
    this.show = function() {
        render('.screens', 'screen1', user, function() {
            bind('.mainContainer .loginSection .userInfo .name .screen .enterButton', function() {
                var localUser = JSON.parse(JSON.stringify(user));
                localUser.userName = $('.loginSection').data('name');
                console.log("client side username: "+JSON.stringify(localUser));                     
                    var temp = {};
                    temp.user = localUser;
                    update(temp);                                
                    socket.emit('user name', user);           
                    $('.mainContainer').hide();
                    $('.chatContainer').show();
                    render('.profileInfo', 'profileData', user);
            })
        })
    }
}

loginScreen1.show(user);


function update(req) {
    user = req.user;
    console.log(req.next)
    switch (req.next) {
        case 'loginScreen1':
            loginScreen1.show(user);
            break;
    }
}

//multiple screens render closed here





//connected onlineUsers start here

socket.on('connectedUsers', function(onlineUsers) {
    var i = 0;

    while (i < onlineUsers.length) {
        if (onlineUsers[i].profileId == socket.id) {
            ownId = onlineUsers[i].profileId;
            break;
        }
        i++;
    }
    onlineUsers.splice(i, 1);
    if (notify.length == 0) {
        notify = onlineUsers;
    } else {
        if (onlineUsers.length > notify.length) {
            var temp = 0;
            notify.push({
                profileName: onlineUsers[onlineUsers.length - 1].profileName,
                profileId: onlineUsers[onlineUsers.length - 1].profileId,
                profileImage: onlineUsers[onlineUsers.length - 1].profileImage,
                counter: temp
            })
        } else {
            var temp = [];
            for (var i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].profileId == notify[i].profileId) {
                    temp.push({
                        profileName: notify[i].profileName,
                        profileId: onlineUsers[i].profileId,
                        counter: notify[i].counter
                    })
                }
            }
            notify = temp;
        }
    }
    render('.usersContainer', 'user', onlineUsers);
});
//connected onlineUsers closed here


//show chatPanel start here

function showchatPanel(data) {
    console.log("Socket Id of current User: " + socket.id);

    receiverId = data.getAttribute("data-id");
    recieverName = data.getAttribute("name");
    reciverImage = data.getAttribute("profileImage");
    activeDiv = receiverId;
    var senderID = socket.id;
    console.log('reciver ID ' + receiverId);
    console.log('reciver Name ' + recieverName);

    $('.chatContainer .chatPanel .userInfo2 .userName').empty();
    $('.userInfo2').show();
    $('.chatBoxWindow').show();
    $('.messageBox').show();
    $(".chatContainer .chatPanel .userInfo2 .userName").text(recieverName);
    $('.usersContainer .user .' + receiverId).hide();

    for (var i = 0; i < notify.length; i++) {
        if (notify[i].profileId == receiverId) {
            notify[i].counter = 0;
        }
    }
    showChats(receiverId);
};

// show chatPanel closed here


//message send start from here

bind('.chatPanel .messageBox .sendButton', function() {
    var messageText = $('.chatContainer .chatPanel .messageBox .textBox .textArea').val();
    socket.emit('chatting', messageText, user, receiverId,recieverName);
    $('.chatContainer .chatPanel .messageBox .textBox .textArea').val('');
});

//message send closed here

//sender peer message start here
socket.on('senderPeer', function(message, from, to) {
    messages.push({
        message: message,
        from: from,
        to: to
    })
    showChats(receiverId);
});

//sender peer message closed here


//reciver peer message start here

socket.on('reciverPeer', function(message, from, to) {
    console.log(message);
    messages.push({
        message: message,
        from: from,
        to: to
    })
    if (activeDiv != from) {
        for (var i = 0; i < notify.length; i++) {
            if (notify[i].profileId == from) {
                notify[i].counter = notify[i].counter + 1;
                $('.usersContainer .user .notification .' + from).show();
                $('.usersContainer .user .notification .' + from).empty();
                $('.usersContainer .user .notification .' + from).text(notify[i].counter);
                console.log(notify[i].counter);
            }
        }
    }
    showChats(receiverId);
    recieverId = from;
});

//reciver peer message closed here

// function show chats start here
function showChats(data) {
    var newMessages = [];
    for (var i = 0; i < messages.length; i++) {
        if ((messages[i].from == ownId && messages[i].to == data) || (messages[i].from == data && messages[i].to == ownId)) {
            if (messages[i].from == ownId && messages[i].to == data) {
                newMessages.push({
                    message: messages[i].message,
                    from: messages[i].from,
                    to: messages[i].to,
                    show: 'senderContainer'
                })
            } else {
                newMessages.push({
                    message: messages[i].message,
                    from: messages[i].from,
                    to: messages[i].to,
                    show: 'reciverContainer'
                })
            }
        }
    }
    console.log(newMessages);

    render('.chatBoxWindow', 'message', newMessages);
}
// function show chats closed here