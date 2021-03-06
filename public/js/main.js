// const moment = require('moment');

const chatForm = document.getElementById('chat-form');
const chatMsgs = document.querySelector('.messages-chat');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('usersList');
var url = window.location.search.split("&");
var u = url[0].split("=");
var r = url[2].split("=");
var name = u[1];
var room = r[1];

function getDataInfo() {
    var url_string = window.location.search;
    var z = url_string.split("&");
    return z;
}
function updateChatInfo(room, username) {
    // var u = array[0].split("=");
    // var r = array[2].split("=");

    // name = u[1];
    // room = r[1];

    // console.log("username", username);

    userList.appendChild(document.createTextNode(username));
    roomName.innerHTML = room;
}

const socket = io();

// var array = getDataInfo();
// updateChatInfo(array);

// console.log(name, array);

socket.emit('joinRoom', { user:name, room:room });

// get room and users
socket.on('roomUsers', ({room, users}) => {
    console.log("roomUSERS", users);
    var array = getDataInfo();
    updateChatInfo(room, users);
    outputUsers(users);
});


// message from server
socket.on('message', (message) => {
    console.log("message: ", message);
    outputMessage(message);

    chatMsgs.scrollTop = chatMsgs.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    // console.log("MSG::`",msg);

    if (!msg) {
        return false;
    }

    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message
function outputMessage(message) {
    const div = document.createElement('div');

    // var s = message.split(" ");
    // var m = s[0].split("Welcome");

    console.log("outputMESSAGE:", message);

    div.classList.add('message');
    const p = document.createElement('text');
    p.innerHTML += '<span> ' + message + ' </span>'
    div.appendChild(p)

    // div.classList.add('message');
    // const p2 = document.createElement('p2');
    // p2.classList.add('meta');
    // p2.innerHTML += s[1];
    // // p.innerText = username;
    // // p2.innerHTML += '<span>' +  new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds() + '</span>';
    // div.appendChild(p2);

    // const p1 = document.createElement('p');
    // p1.classList.add('text');
    // p1.innerHTML += message;
    // div.appendChild(p2);

    document.querySelector('.messages-chat').appendChild(div);
}

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    }
});