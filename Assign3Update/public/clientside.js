// let socket = io();
let username = [];

$(function() {
//    var socket = io();
    var socket = io.connect('http://localhost:3000');
    let thisusername; // = 'Guest' + Math.round(Math.random() * 10000); //Generate a random nick for new clients
    let servercurrenttime;
    let usercolor;
    let nameused = false;

    $(document).ready(function() {
        socket.emit('new user');
    });

    $('#send-message').submit(function(e) {

        e.preventDefault();

        username.push(thisusername);
        var temp = $('#m').val();
        socket.emit('chat message', temp);


        $('#m').val('');
        return false;
    });

    socket.on('changed color', function(data) {
        // if(usercolor === ''){
        //     usercolor === data.color;
        // }
    //    console.log('user color is ' + usercolor);
        if (data.color !== usercolor) {
            //    if (data.msg.toLowerCase().includes('/color')) {
            usercolor = data.color;
            htmlCode = '<p> >>>>> Your nick color has changed to ' + data.color + '</p>';
        }
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    socket.on('chatlog', function(data) {
        thisusername = data.nick;
        $('#whoiam').html("Welcome to the Chat " + thisusername);
        $('#messages').append(data.msg + ' here i am ' + "<br/>");
    });

    socket.on('name exists', function(data) {
        let dataparts = data.msg.split(' ');

        newname = dataparts[1];
        htmlCode = '<p> >>>>> ' + newname + ' is already in use </p>';
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        nameused = true;

    });
    socket.on('name DNE', function(data) {
    //    console.log('name dne');
        nameused = false;
        let dataparts = data.msg.split(' ');

        newname = dataparts[1];

        htmlCode = '<p> >>>>> Your nick has changed to ' + newname + '</p>';
        // }
        thisusername = newname;
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        $('#whoiam').html("Welcome to the Chat " + thisusername);
    });
    socket.on('new message', function(data) {
        let htmlCode
        // console.log('data is ' + data.msg);
        // console.log('datanick is ' + data.nick + 'usernamethis is ' + thisusername);
        // console.log('data color is ' + data.color);
        // console.log('done');
        if (data.msg.trim() === "") {
            return;
        }

        if (data.nick === thisusername) {
            htmlCode = '<p><span id="time" style="color:black; font-weight: bold;"> ' + data.time + '</span><span id="' + data.nick + '" style="color: ' + data.color + '; font-weight: bold;"> ' + ' ' + data.nick + '</span><span id="text" style="color: black; font-weight: bold;" >' + ': ' + data.msg + '</span></p>';
            //     $('#messages').append($('<li>').text(msg));
        //    console.log('htmlcode is ' + htmlCode);
            $('#messages').append(htmlCode);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }
        else { // overrides
        //    console.log('wellll');
            let htmlCode2 = '<p><span id="time" style="color:black;"> ' + data.time + '<span id="' + data.nick + '" style="color: ' + data.color + ';">' + ' ' + data.nick + '</span> <span id="text" style="color: black;" >' + ': ' + data.msg + '</span> </p>';
            $('#messages').append(htmlCode2);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }
    });

    socket.on('usernames', function(nicknames) {
        console.log('thisusername', thisusername);

        $('#currentusers').html("Current users: " + nicknames + "<br>");
    });
});
