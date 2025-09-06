import { useEffect, useState, useMemo,useRef } from "react";
import React from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useGSAP } from "@gsap/react";
import {gsap} from "gsap"
import {
  Box,
  Button,
  Container,
  duration,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Group() {
   const gsapRef=useRef();
   const [rotate,setRotate]=useState(0);
   useGSAP(
    ()=>{
      const t1=gsap.timeline();
      t1.to(gsapRef.current,{
        duration:2,
        delay:0.2,
        rotate:rotate,
        ease:"power2.inOut"
      })
       t1.to(gsapRef.current,{
        duration:2,
        delay:1,
        rotate:0,
        ease:"power2.inOut"
      });
    },
    {scope:gsapRef,dependencies:[rotate]}
   );

   useEffect(()=>{
    var h4=document.querySelector(".Box h4");
    var h4Text=h4.textContent;
    var split_Text=h4Text.split("")
    var clutter="";
    var len=Math.ceil(5);
    split_Text.forEach(function(e,i)
    {
      let char=e===" "?"&nbsp;":e;
      if(i<=len)
       clutter+=`<span class=${"a"} style="display:inline-block">${char}</span>`  //used inline block to do 2d animations
      else
        clutter+=`<span class=${"b"} style="display:inline-block">${char}</span>`
    })
    h4.innerHTML=clutter;
    console.log(h4.innerHTML)
    gsap.from(".Box h4 .a",{
      y:-100,
      x:-100,
       duration:0.3,
      delay:0.5,
      opacity:0,
      stagger:0.3,
     })
     gsap.from(".Box h4 .b",{
      y:100,
      x:100,
       duration:0.3,
      delay:0.5,
      opacity:0,
      stagger:-0.25,
     
     })
     },[])







  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //setting of permanent userId
  const userId = useMemo(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4(); //generate once
      localStorage.setItem("userId", userId);
    }
    return userId;
  }, []);
  const socket = useMemo(
    () => io("https://web-socket-chat-app-1-backend-3.onrender.com", { query: { userId } }),
    []
  );
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    alert(`✅ Successfully joined room ${roomName}`);
    console.log(`${socketID} user joined ${roomName}`);
    setRoomName("");
  };

  useEffect(() => {
    const currentDate = new Date().toLocaleTimeString();
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("recieve-message", ({ message, sender, room }) => {
      console.log("Message from room:", sender, "->", message);
      setMessages((messages) => [
        ...messages,
        { message, sender, room, currentDate },
      ]);
    });

    return () => {
      console.log("i disconnected");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <Container maxWidth="sm">
        <Box className="Box"
         sx={{
          color:"rgba(164, 216, 234, 1)",
           height: 200,
           fontSize:"40px",
           fontWeight: "bold",
           textShadow:"2px 16px 11px  #0f100fff ",
           display: "flex",           // make it flexbox
           justifyContent: "center",  // horizontal center
           alignItems: "center",      // vertical center
         }}
       >
       <h4>GROUP CHATS</h4>
       </Box>

        {/* User ID box */}
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            backgroundColor:  "lightgreen",
            backgroundImage:"linear-gradient(to bottom left,green,yellow)",
            padding: "8px",
            borderRadius: "8px",
            margin: "4px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 90, fontWeight: "bold" }}>User ID:</Box>
          <Box sx={{ width: 400, wordBreak: "break-all" }}>{userId}</Box>
        </Typography>

        {/* Join Room */}
        <Box
          component="form"
          onSubmit={joinRoomHandler}
          sx={{
            backgroundColor: "lightred",
             backgroundImage:"linear-gradient(to bottom right,lightyellow,blue)",
            padding: "16px",
            borderRadius: "8px",
            margin: "12px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            label="Room Name"
            variant="outlined"
            required="true"
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </Box>

        {/* Send Message */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "lightblue",
            backgroundImage:"linear-gradient(to bottom left,coral,lightblue)",
            padding: "16px",
            borderRadius: "8px",
            margin: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Start messaging here..."
            variant="outlined"
            required="true"
            fullWidth
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            label="Group Room Name"
            variant="outlined"
            required="true"
            fullWidth
          />
          <Button ref={ gsapRef} type="submit" variant="contained" color="primary" onClick={()=>{setRotate(gsap.utils.random(-360,360))}}>
            Send
          </Button>
        </Box>

        {/* Messages */}
        <Stack
          sx={{
            backgroundColor: messages.length > 0 ? "coral" : "lightred",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            margin: "12px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          {messages.map((m, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "8px",
                borderRadius: "6px",
                width: "100%",
              }}
            >
              {`[Sender: ${m.sender} | Group: ${m.room}] → ${m.message}  @ ${m.currentDate}`}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default Group;
