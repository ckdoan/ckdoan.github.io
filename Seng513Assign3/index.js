//Author: Carolyn Doan
//Assignment 3 for SENG 513
//User ID: 10122518
//Lab: B03

//Set up for express and socket.io
let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

http.listen(port, function() {
    console.log('listening on *:' + port);
});

let nicknames = [];
let currenttime = new Date().toLocaleTimeString();
let messages = [];

//Function to generate a random color for new users
function makeRandomColor() {
    let c = '';
    while (c.length < 6) {
        c += (Math.random()).toString(16).substr(-6).substr(-1);
    }
    return '#' + c;
}

//Function to generate a random name new users
function makeRandomName() {
    return 'Guest' + Math.round(Math.random() * 10000);
}

let usercolor = makeRandomColor();
let color;
let socketinfo = {};
let newname;

app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/clientside.html");
});

io.on('connection', function(socket) {

    // This handles new user requests from the client
    socket.on('new user', function(data) {
        socket.nickname = makeRandomName();
        nicknames.push(socket.nickname);
        updateNicknames();

        if (!(socket.nickname in socketinfo)) {
            usercolor = makeRandomColor();
            color = new String(usercolor);
            socketinfo[socket.nickname] = color;
        }

        //Sends the new user any previous chat history if it exists
        socket.emit('chatlog', {
            msg: messages,
            nick: socket.nickname,
            color: socketinfo[socket.nickname]
        });
    });

    //If a user has already established a connection and has a cookie
    socket.on('new user with cookie', function(data) {
        let cookieparts = data.split("=");
        socket.nickname = cookieparts[0];
        nicknames.push(socket.nickname);
        updateNicknames();

        if (!(socket.nickname in socketinfo)) {
            usercolor = cookieparts[1];
            color = new String(usercolor);
            socketinfo[socket.nickname] = color;
        }

        //Sends the user any previous chat history if it exists
        socket.emit('chatlog', {
            msg: messages,
            nick: socket.nickname,
            color: socketinfo[socket.nickname]
        });
    });

    //Handles incoming user messages from the clients
    socket.on('chat message', function(data) {
        data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;"); //input sanitization

        //Handles the /nickcolor command
        if (data.toLowerCase().includes('/nickcolor')) {
            let dataparts = data.split(' ');
            usercolor = dataparts[1];
            color = new String(usercolor)
            socketinfo[socket.nickname] = color;

            socket.emit('changed color', {
                msg: data,
                nick: socket.nickname,
                time: currenttime,
                color: socketinfo[socket.nickname]
            });

            // Handles the /nick command
        } else if (data.toLowerCase().includes('/nick')) {
            let dataparts = data.split(' ');
            newname = dataparts[1];

            if (newname in socketinfo) {
                //inform the client that the name is already in use
                socket.emit('name exists', {
                    msg: data
                });
            } else {
                var oldname = socket.nickname;
                socketinfo[newname] = socketinfo[socket.nickname]; //assign the new name the old color value
                delete socketinfo[oldname];
                nicknames.splice(nicknames.indexOf(socket.nickname), 1);
                socket.nickname = newname;
                nicknames.push(socket.nickname);

                updateNicknames();

                //inform the client that their username has changed
                socket.emit('name DNE', {
                    msg: data
                });
            }
        } else { // no commands given
            temp = '<li id="other"><span id="time" style="color:black;"> ' + currenttime + '<span id="' + socket.nickname + '" style="color: ' + socketinfo[socket.nickname] + ';">' + ' ' + socket.nickname + '</span> <span id="text" style="color: black;" >' + ': ' + data + '</span> </li>';

            messages.push(temp);

            io.emit('new message', {
                msg: data,
                nick: socket.nickname,
                time: currenttime,
                color: socketinfo[socket.nickname]
            });
        }
    });

    //Informs the client of all the active users in the chat
    function updateNicknames() {
        io.emit('usernames', nicknames);
    }

    //Handles the socket disconnect
    socket.on('disconnect', function(data) {
        if (!socket.nickname) {
            return;
        }
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        delete socketinfo[socket.nickname];
        updateNicknames();
    });
});
