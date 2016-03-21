
    var sentTypingEvent = false;
    var nickname = window.prompt("Enter your nickname", "Anonymous");
    var $messageInput = $('#m');
    var $messages = $('#messages');
    var socket = io();
    var $typing = $('#typing');
    var colors = ["Red", "Orange", "Yellow", "Cyan", "Blue"];
    var userColor = colors[getRandomInt(0,5)];
    $('#username').html(nickname + '$');
    $("#username").css({color: userColor});
    $('#m').css({color: userColor});
    $('#m').focus();

    socket.emit('add user', nickname);

    $('form').submit(function () {
        var message = {message: $('#m').val(), color: userColor};
        socket.emit('chat message', message);
        $messageInput.val('');
        socket.emit('stop typing');
        return false;
    });
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    socket.on('chat message', function (obj) {
        $messages.append($('<li style="color:' + obj.color + ';">').text(obj.username + ': ' + obj.message));
        sentTypingEvent = false;
    });

    socket.on('number users', function (obj) {
        $("#nrUsers").text(obj.nrUsers + " hacker(s) online");
    })

    $messageInput.on('input', function () {
        socket.emit('typing');
    });

    socket.on('stop typing', function (obj) {
        $('.typing-' + obj.username).remove();
    });

    socket.on('typing', function (user) {
        if (!sentTypingEvent && user.username != nickname) {
            data = '<div class="typing-' + user.username + '"> ' + user.username + ' is typing... </div>';
            $typing.append(data);
        }
        sentTypingEvent = true;
    });
