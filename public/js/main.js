const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById("room-name");
const usersList=document.getElementById("users");

//Get username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true,
});



//message from the server
const socket =io();
//join chatroom
socket.emit('joinRoom',{username,room});

//get room and user
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsersName(users);
})

socket.on('message',message=>{
    outputMsg(message);
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

//Message Submit


chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //Get Message
    const msg=e.target.elements.msg.value;
    //Emitting a message to server
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})
function outputMsg(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>&nbsp;${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM

function outputRoomName(room){
 roomName.innerText=room;
}
//Add user to DOM
function outputUsersName(users){
    usersList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}