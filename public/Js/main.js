const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

//join room
socket.emit("joinRoom", {username, room})

socket.on('roomUsers', ({room, users}) => {
    showAllUsers(users);
    showRoomName(room);
})

//message from server
socket.on('message', message=>{
    if(message['text'] !== "")
        outputMessage(message);
    
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //emit message to the server
    socket.emit('chatMessage', msg);

        //clear input
    e.target.elements.msg.value = '';
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message['username']} <span>${message['time']}</span></p>
    <p class="text">
    ${message['text']}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

function showAllUsers(users) {
    usersList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

function showRoomName(roomname) {
    roomName.innerHTML = roomname;
}

