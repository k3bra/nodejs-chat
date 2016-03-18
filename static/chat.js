
    var sentTypingEvent = false;
    var nickname = window.prompt("Enter your nickname", "Anonymous");
    var $messageInput = $('#m');
    var $messages = $('#messages');
    var socket = io();
    var $typing = $('#typing');
    $('#name').html('<h1>' + nickname + '</h1>');
    socket.emit('add user', nickname);

    $('form').submit(function () {
        var message = $('#m').val();
        socket.emit('chat message', message);
        $messageInput.val('');
        socket.emit('stop typing');
        return false;
    });

    socket.on('chat message', function (obj) {
        $messages.append($('<li>').text(obj.username + ': ' + obj.message));
        sentTypingEvent = false;
    });

    $messageInput.on('input', function () {
        socket.emit('typing');
    });

    socket.on('stop typing', function (obj) {
        console.log ('Remove' + obj.username);
        $('.typing-' + obj.username).remove();
    });

    socket.on('typing', function (user) {
        if (!sentTypingEvent && user.username != nickname) {
            data = '<div class="typing-' + user.username + '"> ' + user.username + ' is typing... </div>';
            console.log('add' +user.username);
            $typing.append(data);
        }
        sentTypingEvent = true;
    });
