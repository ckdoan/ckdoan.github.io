/*code taken from https://socket.io/get-started/chat/ */
//let app = require('express')();

let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

let nicknames = [];
let currenttime = new Date().toLocaleTimeString();
let messages = [];
// let usercolor = 'red';

function makeRandomColor() {
    var c = '';
    while (c.length < 6) {
        c += (Math.random()).toString(16).substr(-6).substr(-1)
        console.log('c is ' + c);
    }
    return '#' + c;
}

let usercolor = makeRandomColor();
let color;
let socketinfo = {};
let newname;
let newname2;


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

    socket.on('chat message', function(data) {
        if (data.toLowerCase().includes('/color')) {
            let dataparts = data.split(' ');
            usercolor = dataparts[1];
            color = new String(usercolor)
            socketinfo[socket.nickname] = color;
            // return;
            socket.emit('changed color', {
                msg: data,
                nick: socket.nickname,
                time: currenttime,
                color: socketinfo[socket.nickname]
            });

        } else { //if no color command has been specified and it is a new client
            if (!(socket.nickname in socketinfo)) {
                usercolor = makeRandomColor();
                color = new String(usercolor);
                socketinfo[socket.nickname] = color;
            }
        }


        if (data.toLowerCase().includes('/nick')) {
            console.log('in nick in server');
            let dataparts = data.split(' ');

            newname = dataparts[1];
            if (newname in socketinfo) {
                socket.emit('name exists', {
                    msg: data

                });
            } else {

                newname2 = new String(newname);
                var oldname = socket.nickname;
                socketinfo[newname] = socketinfo[socket.nickname]; //assign the new name the old color value
                nicknames.splice(nicknames.indexOf(socket.nickname), 1);
                socket.nickname = newname;
                nicknames.push(socket.nickname);
                delete socketinfo[oldname];
                updateNicknames();
                socket.emit('name DNE', {
                    msg: data
                });

            }
        }


        if (!data.toLowerCase().includes('/color') && !data.toLowerCase().includes('/nick')) {
            console.log('server info in new message ' + data + ' ' + socket.nickname + ' ' + socketinfo[socket.nickname]);
            io.emit('new message', {
                msg: data,
                nick: socket.nickname,
                time: currenttime,
                color: socketinfo[socket.nickname]
            });
        }
    });

    function updateNicknames() {
        console.log('server nicknames are ' + nicknames);
        io.emit('usernames', nicknames);
    }

    socket.on('disconnect', function(data) {
        if (!socket.nickname) {
            return;
        }
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        delete socketinfo[socket.nickname];
        updateNicknames();
    });
});
