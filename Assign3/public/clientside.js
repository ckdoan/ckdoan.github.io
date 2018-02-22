let socket = io();
let username = [];

$(function() {
    var socket = io();
    let thisusername = 'Guest' + Math.round(Math.random() * 10000); //Generate a random nick for new clients
    let servercurrenttime;

    socket.emit('new user', thisusername, function(data) { //sending server the nickname
        if (data) {

        } else {
            $('#messages').append(data + ' is already in use' + "<br/>");
        }
    });

    socket.on('currenttime', function(data) {
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
        if (data.msg === "") {
            return;
        }

        if (data.nick === thisusername) {
            console.log('in here');
            let htmlCode = '<p id="' + data.nick + '" style="color: red; font-weight: bold;">' + data.time + ' ' + data.nick + ': ' + data.msg + ' </p>';
            //     $('#messages').append($('<li>').text(msg));

            $('#messages').append(htmlCode);
            // $('#'+data.nick).css({
            //     'color': 'red',
            //     'background-color': 'pink'
            //
            // });
            //    $('#messages').append(data.time + ' ' + data.nick + ' ' + data.msg + "<br/>")
            // .css({
            //     "color": "red",
            //     "font-weight": "bold"
            // });;
            $('#messages').scrollTop($('#messages')[0].scrollHeight);

        } else { // overrides D:
            // $('#messages').append(htmlCode);
            // $('#'+data.nick).css({
            //     'color': 'red'
            // });
            console.log('wellll');
            let htmlCode2 = '<p id="notme">' + data.time + ' ' + data.nick + ': ' + data.msg + ' </p>';

            $('#messages').append(htmlCode2);
            $('#notme').css({
                'color': 'black'
            });
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
            //
            // $('#messages').append(data.time + ' ' + data.nick + ' ' + data.msg + "<br/>").css({
            //      "color": "black"
            //  });;;
        }

    //    window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('usernames', function(nicknames) {
        //username.push(thisusername);
        //    console.log('username', username);
        $('#whoiam').html("Welcome to the Chat " + thisusername);
        $('#currentusers').html("Current users: " + nicknames + "<br>");
    });
});
