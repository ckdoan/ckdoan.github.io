let socket = io();
let username = [];


$(function() {
    var socket = io();
    let thisusername = 'Guest' + Math.round(Math.random() * 10000);
    let servercurrenttime;

    socket.emit('new user', thisusername, function(data) {
        if (data) {

        } else {
            $('#messages').append(data + ' is already in use' + "<br/>");
        }
    });

    socket.on('currenttime', function(data){
        servercurrenttime = data;
    });

    $('#send-message').submit(function(e) {
        e.preventDefault();
        username.push(thisusername);
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('new message', function(data) {
        console.log('datanick is ' + data.nick + 'usernamethis is ' + thisusername);
        if(data.msg === "")
        {
            return; 
        }
        if (data.nick === thisusername){
            $('#messages').append(data.time + ' ' + data.nick  + ' ' +data.msg + "<br/>").css({"color": "red", "font-weight": "bold"});;
        }
        else { // overrides D:
            $('#messages').append(data.time + ' ' + data.nick  + ' ' +data.msg + "<br/>").css({"color": "black"});;;
        }

        window.scrollTo(0, document.body.scrollHeight);



    });

    socket.on('usernames', function(nicknames) {
        //username.push(thisusername);
    //    console.log('username', username);
    $('#whoiam').html("Welcome " + thisusername);
        $('#currentusers').html("Current users: " + nicknames + "<br/>");
    });
});
