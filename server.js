const express=require("express");
const path=require("path");
const http=require("http");
const socketIo=require("socket.io");
const app=express();
const server=http.createServer(app);
const io=socketIo(server);
const formatMessage=require('./util/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./util/user');



//Static file 
 app.use(express.static(path.join(__dirname,'public')));
 const botName="Admin@Mani360";

 //Run when a client connect
 io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{

    const user=userJoin(socket.id,username,room);
    socket.join(user.room);

        //Welcome note
    socket.emit('message',formatMessage(botName,'Welcome to ChatRoom!'));
     //Brodcast when a User Connects
     socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));
     
 
    // send user and room info
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room),
    });
     //Listen for Chat Message
    socket.on('chatMessage',(msg)=>{
        const us=getCurrentUser(socket.id);
      io.to(us.room).emit('message',formatMessage(us.username,msg));
          });
    
});
 //Runs when disconnects
 socket.on('disconnect',()=>{
     const user=userLeave(socket.id);
     if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
         // send user and room info
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room),
    });
     }
    
});
});






const port=8000 || process.env.PORT;




server.listen(port,(err)=>console.log("Server is running at port:",port));