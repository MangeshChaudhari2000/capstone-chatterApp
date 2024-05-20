// Your Socket.IO client-side code here
var receiver_id;
var sender_id;
var userSocket;
$(document).ready(function () {
    sender_id = $('#user-data').data('users');
    // console.log("sender_id1: " + sender_id._id);
    if (sender_id._id) {
        userSocket = io.connect('/userchat', {
            auth: {
                token: sender_id
            }
        });
    }




    userSocket.on('user_online_event', (userId) => {
        console.log("online event triggered");

        const elementDiv = $(`#${userId}-status`);
        elementDiv.css('color', 'green');
        // in normal js its elementDiv.style.color = 'green';
    });

    userSocket.on('user_offline_event', (userId) => {
        const elementDiv = $(`#${userId}-status`);
        elementDiv.css('color', 'red');
        console.log("offline event triggered");
    });

    $('.userItem').on('click', function () {
        receiver_id = $(this).data('id');
        // console.log("receiver_id: " + receiver_id);
        const obj = {
            sender_id: sender_id._id, receiver_id: receiver_id
        }
        userSocket.emit('existingChat', obj);
        scrollChat();

    });

    console.log("moving to existing connection");
    userSocket.on('loadOldChat', (data) => {
        $('#chat-container').html('');

        let html = '';
        if (Array.isArray(data)) {
            data.forEach(element => {
                console.log(element);
                var userClass = '';
                if (element.sender_id == sender_id._id) {
                    userClass = 'sender';
                } else {
                    userClass = 'receiver';
                }
                html += `<div class="${userClass}"><h5>` + element.message + `</h5></div>`;

            });
            $('#chat-container').append(html);

        }
        scrollChat();

    })

    $('#chat-form').submit(function (event) {
        event.preventDefault();  //prvent reload of page
        console.log("receiverId:" + receiver_id);
        console.log("senderId:" + sender_id._id);

        var inputMessage = $('#message-input').val();  //read value from div message-input
        console.log("input message" + inputMessage);
        $.ajax({
            url: '/chat/saveChat',  //defined url/route
            type: 'POST',  //method type
            data: {    // data to be pass on to url
                sender_id: sender_id._id,
                receiver_id: receiver_id,
                message: inputMessage
            },
            success: function (response) {
                if (response.success) {
                    console.log(response);
                    $('message-input').val('');
                    let chat = response.data.message;
                    let html = `<div class="sender"><h5>` + chat + `</h5></div>`;
                    $("#chat-container").append(html);
                    scrollChat();
                    userSocket.emit('newChat', response.data)
                } else {
                    alert(data.message)
                }
            }
        })

    });

    userSocket.on('loadNewChat', (data) => {
        console.log("data.sender_id: " + data.sender_id);
        console.log("data.receiver_id: " + data.receiver_id);

        // if (receiver_id == data.receiver_id && sender_id == data.sender_id) {
        //     let html = `<div class="receiver"><h5>` + data.message + `</h5></div>`;
        //     $('#chat-container').append(html);
        // } 
        console.log(sender_id._id == data.sender_id && receiver_id == data.receiver_id);
        if (sender_id._id == data.receiver_id && receiver_id == data.sender_id) {

            let html = `<div class="receiver"><h5>` + data.message + `</h5></div>`;
            $('#chat-container').append(html);
        }
        scrollChat();

    })


    function scrollChat() {
        // $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
        $('#chat-container').animate({
            scrollTop: $('#chat-container').offset().top + $('#chat-container')[0].scrollHeight
        }, 0)
    }

});



