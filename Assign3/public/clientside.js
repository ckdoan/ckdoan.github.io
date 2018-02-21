let socket = io();
let username = [];


 $(function() {
     var socket = io();
     let thisusername;

     $('#send-message').submit(function(e) {
         e.preventDefault();
    //     thisusername = 'Guest' + Math.round(Math.random()*10000);
    //     username.push(thisusername);
        // socket.emit('chat message', (thisusername + ': ' + $('#m').val()));
         $('#m').val('');
         return false;
     });
     socket.on('new message', function(msg) {
         $('#messages').append((msg) + "<br/>");
         window.scrollTo(0, document.body.scrollHeight);
     });
 });
