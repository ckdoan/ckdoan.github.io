/*code taken from https://socket.io/get-started/chat/ */
//let app = require('express')();

let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

let nicknames = [];

app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/clientside.html");
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});

io.on('connection', function(socket) {

    socket.on('new user', function(data, callback) {
        if (nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
        }
    });
    socket.on('chat message', function(msg) {
        io.emit('new message', msg);
    });

    function updateNicknames() {
        io.emit('usernames', nicknames);
    }

    socket.on('disconnect', function(data) {
        if (!socket.nickname) {
            return;
        }
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });
});
