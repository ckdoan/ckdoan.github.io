let socket = io();
let username = [];


$(function() {
    var socket = io();
    let thisusername = 'Guest' + Math.round(Math.random() * 10000);;

    socket.emit('new user', thisusername, function(data) {
        if (data) {

        } else {
            $('#messages').append(data + ' is already in use' + "<br/>");
        }
    });


    $('#send-message').submit(function(e) {
        e.preventDefault();
        username.push(thisusername);
        socket.emit('chat message', ('<b>' + thisusername +  '</b>' + ': ' + $('#m').val()));
        $('#m').val('');
        return false;
    });
    socket.on('new message', function(msg) {
        $('#messages').append((msg) + "<br/>");
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('usernames', function(nicknames) {
        //username.push(thisusername);
    //    console.log('username', username);
        $('#currentusers').html("Current users: " + nicknames + "<br/>");
    });
});
