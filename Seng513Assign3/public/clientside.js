//Author: Carolyn Doan
//Assignment 3 for SENG 513
//User ID: 10122518
//Lab: B03

$(function() {
    let socket = io.connect('http://localhost:3000');
    let thisusername; //client nickname
    let servercurrenttime; // current time
    let usercolor; //client color
    let nameused = false; // if the nickname has been taken
    let cookiecreated; // used to see if the cookie has been created

    //When the page has been loaded, send a message to the server, signalling a new user
    $(document).ready(function() {

        if (parseCookie() != null) { //User has visited before
            cookiecreated = true;
            let temp = parseCookie();
            socket.emit('new user with cookie', temp, function(data) {});
        } else { //first time visiting the site
            cookiecreated = false;
            socket.emit('new user');
        }
    });

    //update cookies, incase of name or color change
    function updateCookie(name, color) {
        let expires = "";
        document.cookie = name + "=" + color + expires + "; path=/";
    }

    //creates the cookies
    function createCookie(name, color) {
        let expires = "";
        document.cookie = name + "=" + color + expires + "; path=/";
        cookiecreated = true;
    }

    // This function is used to the parse current browser cookie information
    function parseCookie() {
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let parts = cookie[i].split('=');
            if (parts.length === 2 && parts[1].length !== 0) {
                return parts.join('=');
            }
        }
        return null;
    }

    // This sends the messages that the user has typed to the server
    $('#send-message').submit(function(e) {
        e.preventDefault();
        //    username.push(thisusername);
        let temp = $('#m').val();
        socket.emit('chat message', temp);
        $('#m').val('');
        return false;
    });

    // This handles showing the previous chat log history to new users
    socket.on('chatlog', function(data) {
        thisusername = data.nick;
        usercolor = data.color;

        if (cookiecreated === false) {
            createCookie(thisusername, usercolor);
        }

        $('#currentuser').html("Welcome to the Chat " + thisusername);
        if (data.msg.length != 0) {
            for (let i = 0; i < data.msg.length; i++) {
                let temp = 'id="' + thisusername + '"';
                let idother = 'id="other"';
                let idyou = 'id="you"';

                if (data.msg[i].includes(temp)) {
                    data.msg[i] = data.msg[i].replace(idother, idyou);
                }

                $('#messages').append(data.msg[i]);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            }
        }
    });

    // This handles the /nickcolor command
    socket.on('changed color', function(data) {
        let oldcolor = usercolor;
        let htmlCode;

        if (data.color !== usercolor) {
            usercolor = data.color;
            htmlCode = '<li> >>>>> Your nick color has changed to ' + data.color + '</li>';
        }
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        createCookie(thisusername, usercolor);

    });

    // This handles the functionality of /nick command and if the name already exists
    socket.on('name exists', function(data) {
        let dataparts = data.msg.split(' ');
        let newname = dataparts[1];
        let htmlCode = '<li> >>>>> ' + newname + ' is already in use </li>';
        $('#messages').append(htmlCode);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        nameused = true;

    });

    // This handles the functionality of /nick command and if the name does not exist
    socket.on('name DNE', function(data) {
        let oldname = thisusername;
        nameused = false;
        let dataparts = data.msg.split(' ');

        let newname = dataparts[1];

        let htmlCode = '<li> >>>>> Your nick has changed to ' + newname + '</li>';
        thisusername = newname;

        $('#messages').append(htmlCode);

        let temp = $('#messages').html();
        let re = new RegExp(oldname, 'g');
        temp = temp.replace(re, newname);

        $('#messages').html(temp);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        $('#currentuser').html("Welcome to the Chat " + thisusername);

        updateCookie(thisusername, usercolor);
        createCookie(oldname, "", -1);
    });

    //This handles when the user sends a message
    socket.on('new message', function(data) {
        let htmlCode

        // Ignores if the user does not enter a message
        if (data.msg.trim() === "") {
            return;
        }

        //input sanitization
        data.msg = data.msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (data.nick === thisusername) {
            htmlCode = '<li id = "you"><span id="time" style="color:black; font-weight: bold;"> ' + data.time + '</span><span id="' + data.nick + '" style="color: ' + data.color + '; font-weight: bold;"> ' + ' ' + data.nick + '</span><span id="text" style="color: black; font-weight: bold;" >' + ': ' + data.msg + '</span></li>';
            $('#messages').append(htmlCode);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        } else { // prints the contents sent from other users
            let htmlCode2 = '<li id = "other"><span id="time" style="color:black;"> ' + data.time + '<span id="' + data.nick + '" style="color: ' + data.color + ';">' + ' ' + data.nick + '</span> <span id="text" style="color: black;" >' + ': ' + data.msg + '</span> </li>';
            $('#messages').append(htmlCode2);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }
    });

    //returns only unique items of an array
    function unique(value, index, self){
        return self.indexOf(value) === index;
    }

    //Displays all the current users
    socket.on('usernames', function(nicknames) {
        let namearray = [];
        namearray.push("<h4>Current Users:</h4><br>");

        for (let i = 0; i<nicknames.length; i++){
            namearray.push( nicknames[i] + "<br>")
        }
        namearray = namearray.filter(unique);

        $('#currentusers').html(namearray);
    });

    //Handles client disconnect
    socket.on('disconnect', function() {
        cookiecreated = true;
    });

});
