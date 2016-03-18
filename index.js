var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('add user', function (username) {
        socket.username = username;
    });

    socket.on('chat message', function (msg) {
        io.emit('chat message', {message: msg, username: socket.username});
    });

    socket.on('typing', function () {
        io.emit('typing', {username: socket.username})
    });

    socket.on('stop typing', function () {
        io.emit('stop typing', {username: socket.username})
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
