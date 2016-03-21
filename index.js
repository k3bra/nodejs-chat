var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
nrUsers = 0;
io.on('connection', function (socket) {
    socket.on('add user', function (username) {
        socket.username = username;
        ++nrUsers;
        io.emit('number users', {nrUsers: nrUsers});
    });

    socket.on('chat message', function (msg) {
        io.emit('chat message', {message: msg.message, color: msg.color, username: socket.username});
    });

    socket.on('typing', function () {
        socket.broadcast.emit('typing', {username: socket.username})
    });

    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {username: socket.username})
    });

    socket.on('disconnect', function () {
      --nrUsers;
      io.emit('number users', {
        nrUsers: nrUsers
      });
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
