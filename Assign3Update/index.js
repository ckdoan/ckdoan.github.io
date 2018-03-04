/*code taken from https://socket.io/get-started/chat/ */
//let app = require('express')();

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

function makeRandomColor() {
    var c = '';
    while (c.length < 6) {
        c += (Math.random()).toString(16).substr(-6).substr(-1)
    }
    return '#' + c;
}

function makeRandomName(){
    return 'Guest' + Math.round(Math.random() * 10000);
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

io.on('connection', function(socket) {

    socket.on('new user', function(data) { //}, callback) {
        socket.nickname = makeRandomName(); //data;
        nicknames.push(socket.nickname);
        updateNicknames();
        if (!(socket.nickname in socketinfo)) {
            usercolor = makeRandomColor();
            color = new String(usercolor);
            socketinfo[socket.nickname] = color;
        }
        // }
//        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA');
//        console.log('serv erusername', messages);
        socket.emit('chatlog', {
            msg: messages,
            nick: socket.nickname,
            color: socketinfo[socket.nickname]
        });
    });
    socket.on('new user with cookie', function(data){
        let cookieparts = data.split("=");
        socket.nickname = cookieparts[0]; //data;
        nicknames.push(socket.nickname);
        updateNicknames();
        if (!(socket.nickname in socketinfo)) {
            usercolor = cookieparts[1];
            color = new String(usercolor);
            socketinfo[socket.nickname] = color;
        }
        // }
    //    console.log("asdasfasgadasdasd--------------------");
    //    console.log('serv erusername', messages);
        socket.emit('chatlog', {
            msg: messages,
            nick: socket.nickname,
            color: socketinfo[socket.nickname]
        });
    });

    socket.on('chat message', function(data) {
        //    socket.nickname = 'Guest' + Math.round(Math.random() * 10000);
        //    nicknames.push(socket.nickname);
        //    updateNicknames();
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
        } else if (data.toLowerCase().includes('/nick')) {
            //    console.log('in nick in server');
            let dataparts = data.split(' ');
            newname = dataparts[1];

            if (newname in socketinfo) {
                socket.emit('name exists', {
                    msg: data
                });
            } else { // if name change is possible
                newname2 = new String(newname);
                var oldname = socket.nickname;
                socketinfo[newname] = socketinfo[socket.nickname]; //assign the new name the old color value
                delete socketinfo[oldname];
                nicknames.splice(nicknames.indexOf(socket.nickname), 1);
                socket.nickname = newname;
                nicknames.push(socket.nickname);

                updateNicknames();

                socket.emit('name DNE', {
                    msg: data
                });
            }
        }
        else { // no commands given
    //     console.log('server info in new messag');
        //    temp = '<p  style="color:green;">'+ data +'</p>'
            temp = '<p><span id="time" style="color:black;"> ' + currenttime + '<span id="' + socket.nickname + '" style="color: ' + socketinfo[socket.nickname] + ';">' + ' ' + socket.nickname+ '</span> <span id="text" style="color: black;" >' + ': ' + data + '</span> </p>';

            messages.push(temp);

            io.emit('new message', {
                msg: data,
                nick: socket.nickname,
                time: currenttime,
                color: socketinfo[socket.nickname]
            });
    }
    });


    function updateNicknames() {
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
