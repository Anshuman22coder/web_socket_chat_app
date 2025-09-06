import express from "express"
import { Server } from "socket.io"
import {createServer} from "http"
const app=express()

import {Users,Messages,connectDb} from "./db.js"




const server=createServer(app);//the whole server is instantiated ..with http
const io=new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
    credentials:true
  }
}); //the whole io circut is instantaited..
const userSocketmap={} //userId:socket.id

io.on("connection",async(socket)=>{  //listens .. to incomming connections..
  //1.client connects
  const userId=socket.handshake.query.userId;

  if(userId)
  {
    userSocketmap[userId]=socket.id;
    //mongoDb id storing
    const user=await Users.findOne({"id":userId});
    if(user){
      console.log("User found",user.id)
    }
    else
    {
      await Users.create({"id":userId});
      console.log("new USER created in db")
    }




    console.log(`User ${userId} connected with socket ${socket.id}`);




    //sending of user datas to the client...
   const history = await Messages.find({
  $or: [
    {"receiver": userId},
    {"sender": userId}
  ]
})
        .sort({currentDate:-1})   //ascending order..latest 5 picked up
        .limit(5)
        history.reverse();      //they are reversed now..
    socket.emit("chat-history",history)
  }

  console.log("User Connected");
  console.log("Id",socket.id);

  //socket.emit("welcome",`welcome to the server ${socket.id}`);
  socket.on("message",({room,message})=>{ // 2. message received from client
    console.log({room,message});//triggered by frontend when button of form is submitted ,,
   socket.to(room).emit("recieve-message", { message,sender: userId ,room}); 
    /*{
  message: "hello",
  sender: "abc123"
}*/

  })

   





  let sendervalue;
    socket.on("message_Individual",async({room,message})=>{ // 2. message received from client
      const currentDate=new Date().toLocaleTimeString();
      
      if((Object.entries(userSocketmap).length)>1)
        console.log("PRESENT")
      for (let [key,value] of Object.entries(userSocketmap))  //objects to arrays..
      { key=key.trim()
        if(key===room.trim())
        {
           sendervalue=value;
           console.log("I entered here")
           break;
        }
        console.log({"key":key})
        
      }
      //save to Db
      try{
        const savedMessage=await Messages.create({
        receiver:room,
        sender:userId,
        message:message,
        currentDate:new Date()
        
      })
       console.log({room,message});//triggered by frontend when button of form is submitted ,,
   socket.to(sendervalue).emit("recieve-message", {id:savedMessage.receiver, sender: savedMessage.sender,message:savedMessage.message, currentDate:savedMessage.currentDate}); 
    
    }
      catch(error){
      console.log("could not do the db transcations of msg storing ",error)
      }
      
    


   
    /*{
  message: "hello",
  sender: "abc123"
}*/

  })
  

  
  // 3. client wants to join a room
  socket.on("join-room",(room)=>{
    socket.join(room);
    console.log(`User joined room ${room}`);
  })
  
  socket.on("disconnect",()=>{  //triggered from frontend
    console.log("User disconnected",socket.id);
  })
})

app.get("/",(req,res)=>{
  res.send("HI")
})

connectDb().then(()=>{
server.listen (4000,()=>{
  console.log('server listening at 4000')
})
})
