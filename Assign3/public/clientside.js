let socket = io();
let username = [];

$(function() {
    var socket = io();
    let thisusername = 'Guest' + Math.round(Math.random() * 10000); //Generate a random nick for new clients
    let servercurrenttime;
    let usercolor;
    //let usercolor = 'red'; //default is red
    // let usercolor = function random_hex(){
    //     return '#' + Math.floor(Math.random()*16777215).toString(16);}();

    socket.emit('new user', thisusername, function(data) { //sending server the nickname
        if (data) {

        } else {
            $('#messages').append(data + ' is already in use' + "<br/>");
        }
    });

    // socket.emit('user color', usercolor, function (data) {
    //
    // });
    // //
    // socket.on('currenttime', function(data) {
    //     servercurrenttime = data;
    // });

    $('#send-message').submit(function(e) {
        e.preventDefault();
        username.push(thisusername);
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('changed color', function(data) {
        // if(usercolor === ''){
        //     usercolor === data.color;
        // }
        console.log('user color is ' + usercolor);
        if (data.color !== usercolor) {
            //    if (data.msg.toLowerCase().includes('/color')) {
            // console.log('why am i here> ugh ');
            usercolor = data.color;
            htmlCode = '<p> >>>>> Your nick color has changed to ' + data.color + '</p>';
        }
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    socket.on('new message', function(data) {
        let htmlCode
        console.log('data is ' + data.msg);
        console.log('datanick is ' + data.nick + 'usernamethis is ' + thisusername);
        console.log('data color is ' + data.color);
        console.log('done');
        if (data.msg === "") {
            return;
        }

        if (data.nick === thisusername) {
            console.log('in here');

            if (data.msg.toLowerCase().includes('/color')) {
                usercolor = data.color;
                htmlCode = '<p> >>>>> Your nick color has changed to ' + data.color + '</p>';
            }
            //usercolor = data.color;
            else {
                htmlCode = '<p><span id="time" style="color:black; font-weight: bold;"> ' + data.time + '</span><span id="' + data.nick + '" style="color: ' + data.color + '; font-weight: bold;"> ' +' ' + data.nick + '</span><span id="text" style="color: black; font-weight: bold;" >' + ': ' + data.msg + '</span></p>';
                //     $('#messages').append($('<li>').text(msg));
                console.log('htmlcode is ' + htmlCode);
            }
            $('#messages').append(htmlCode);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        } else { // overrides D:

            console.log('wellll');
            //    let htmlCode2 = '<p id="notme">' + data.time + ' ' + data.nick + ': ' + data.msg + ' </p>';
            let htmlCode2 = '<p><span id="time" style="color:black; font-weight: bold;"> ' + data.time + '<span id="' + data.nick + '" style="color: ' + data.color + ';">' + ' ' + data.nick + '</span> <span id="text" style="color: black;" >' + ': ' + data.msg + '</span> </p>';
            $('#messages').append(htmlCode2);
            // $('#notme').css({
            //     'color': 'black'
            // });
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
