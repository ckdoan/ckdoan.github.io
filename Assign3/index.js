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

function makeRandomColor(){
  var c = '';
  while (c.length < 6) {
    c += (Math.random()).toString(16).substr(-6).substr(-1)
    console.log('c is ' + c);
  }
  return '#'+c;
}

let usercolor = makeRandomColor();
let color;
var socketinfo= {};
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
        // socketinfo[socket.nickname] = new Array();
    });
    // socket.on('user color', function(data){
    //
    //     usercolor = data;
    // });
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
                // color: color
                color:socketinfo[socket.nickname]
            });

        } else {
            if ( !(socket.nickname in socketinfo)){
                usercolor  = makeRandomColor();
            }

            console.log('color is colo '+ usercolor);
            color = new String(usercolor);
            socketinfo[socket.nickname] = color;
        }


        if (data.toLowerCase().includes('/nick')) {
            let dataparts = data.split(' ');

            newname = dataparts[1];
            if (newname in socketinfo){
                socket.emit('name exists', {
                    msg: data,
                });
            }
            newname2 = new String(newname);
            var oldname = socket.nickname;
            socketinfo[newname] = socketinfo[socket.nickname]; //assign the new name the old color value

            socket.nickname = newname;
            delete socketinfo[oldname];
            updateNicknames()
        }


        if (!data.toLowerCase().includes('/color') && !data.toLowerCase().includes('/nick')  ) {
        io.emit('new message', {
            msg: data,
            nick: socket.nickname,
            time: currenttime,
            // color: color
            color:socketinfo[socket.nickname]
        });
    }
        // io.emit('currenttime', currenttime);
        // usercolor = 'red';
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
