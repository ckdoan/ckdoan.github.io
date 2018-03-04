let username = [];

$(function() {
    let socket = io.connect('http://localhost:3000');
    let thisusername;
    let servercurrenttime;
    let usercolor;
    let nameused = false;
    let cookiecreated;

    $(document).ready(function() {

        if (parseCookie() != null) {
            cookiecreated = true;
            let temp = parseCookie();
            socket.emit('new user with cookie', temp, function(data) {

            });
        } else { //first time visiting the site
            cookiecreated = false;
            socket.emit('new user');
        }
    });

    function updateCookie(name, color) {
        let expires = "";
        document.cookie = name + "=" + color + expires + "; path=/";

    }
    //creates and updates the cookies
    function createCookie(name, color) {
        //         if (hours)
        // {
        //     var date = new Date();
        //     date.setTime(date.getTime()+(hours*60*60*1000));
        //     var expires = "; expires="+date.toGMTString();
        // }
        // else
        // {
        //     var expires = "";
        // }

        let expires = "";
        document.cookie = name + "=" + color + expires + "; path=/";
        cookiecreated = true;
    }

    function parseCookie() {
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let parts = cookie[i].split('=');
            if (parts.length === 2 && parts[1].length !== 0) {
                console.log('parts, ', parts.join('='));
                return parts.join('=');
            }
        }
        return null;
    }

    $('#send-message').submit(function(e) {
        e.preventDefault();
        username.push(thisusername);
        let temp = $('#m').val();
        socket.emit('chat message', temp);
        $('#m').val('');
        return false;
    });

    socket.on('chatlog', function(data) {
        thisusername = data.nick;
        usercolor = data.color;
        if (cookiecreated === false) {
            createCookie(thisusername, usercolor);
        }

        $('#whoiam').html("Welcome to the Chat " + thisusername);
        if (data.msg.length != 0) {
            for (let i = 0; i < data.msg.length; i++) {
                $('#messages').append(data.msg[i]);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            }
        }
    });

    socket.on('changed color', function(data) {
        // if(usercolor === ''){
        //     usercolor === data.color;
        // }
        //    console.log('user color is ' + usercolor);
        let oldcolor = usercolor;
        //        console.log('userclor is ', usercolor);
        if (data.color !== usercolor) {
            //    if (data.msg.toLowerCase().includes('/color')) {
            usercolor = data.color;
            htmlCode = '<li> >>>>> Your nick color has changed to ' + data.color + '</li>';
        }
        $('#messages').append(htmlCode);

        let temp = $('#messages').html();
        let temp2 = temp.replace(oldcolor, data.color);
        $('#messages').html(temp2);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        createCookie(thisusername, usercolor);

    });



    socket.on('name exists', function(data) {
        let dataparts = data.msg.split(' ');

        newname = dataparts[1];
        htmlCode = '<li> >>>>> ' + newname + ' is already in use </li>';
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        nameused = true;

    });
    socket.on('name DNE', function(data) {
        let oldname = thisusername;
        nameused = false;
        let dataparts = data.msg.split(' ');

        newname = dataparts[1];

        htmlCode = '<li> >>>>> Your nick has changed to ' + newname + '</li>';
        thisusername = newname;
        $('#messages').append(htmlCode);
        console.log('oldname', oldname);
        console.log('newname', thisusername);
        let temp = $('#messages').html();

        if (temp.includes(oldname)) {
            //        console.log('in ehere');
        }
        let temp2 = temp.replace(oldname, thisusername);

        $('#messages').html(temp2);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        $('#whoiam').html("Welcome to the Chat " + thisusername);
        updateCookie(thisusername, usercolor);
        createCookie(oldname, "", -1);
    });
    socket.on('new message', function(data) {
        let htmlCode

        if (data.msg.trim() === "") {
            return;
        }

        if (data.nick === thisusername) {
            htmlCode = '<li id = "you"><span id="time" style="color:black; font-weight: bold;"> ' + data.time + '</span><span id="' + data.nick + '" style="color: ' + data.color + '; font-weight: bold;"> ' + ' ' + data.nick + '</span><span id="text" style="color: black; font-weight: bold;" >' + ': ' + data.msg + '</span></li>';
            //     $('#messages').append($('<li>').text(msg));
            $('#messages').append(htmlCode);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        } else { // prints the contents sent from other users
            let htmlCode2 = '<li id = "other"><span id="time" style="color:black;"> ' + data.time + '<span id="' + data.nick + '" style="color: ' + data.color + ';">' + ' ' + data.nick + '</span> <span id="text" style="color: black;" >' + ': ' + data.msg + '</span> </li>';
            $('#messages').append(htmlCode2);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }
    });

    socket.on('usernames', function(nicknames) {
        $('#currentusers').html("Current users: " + nicknames + "<br>");
    });

    socket.on('disconnect', function() {
        cookiecreated = true;
    });

});
