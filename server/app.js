import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"
const app = express()

import { Users, Messages, connectDb } from "./db.js"

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const userSocketmap = {} // userId: socket.id

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketmap[userId] = socket.id;

    // Check and create a new user in DB if not found
    const user = await Users.findOne({ "id": userId });
    if (user) {
      console.log("User found", user.id);
    } else {
      await Users.create({ "id": userId });
      console.log("New USER created in db");
    }

    console.log(`User ${userId} connected with socket ${socket.id}`);

    // Send chat history to the client
    const history = await Messages.find(
      
        { "receiver": userId }
      
      
    )
      .sort({ currentDate: -1 })
      .limit(5);

    history.reverse();
    socket.emit("chat-history", history);
  }

  console.log("User Connected");
  console.log("Id", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("recieve-message", { message, sender: userId, room });
  });

  socket.on("message_Individual", async ({ room, message }) => {
    const currentDate = new Date();
    const receiverSocketId = userSocketmap[room.trim()];

    if (receiverSocketId) {
      try {
        const savedMessage = await Messages.create({
          receiver: room,
          sender: userId,
          message: message,
          currentDate: currentDate
        });

        console.log({ room, message });
        
        // Emit the message to the correct receiver's socket
        socket.to(receiverSocketId).emit("recieve-message", {
          id: savedMessage.receiver,
          sender: savedMessage.sender,
          message: savedMessage.message,
          currentDate: savedMessage.currentDate
        });
        
      } catch (error) {
        console.log("Could not perform DB transactions for message storage", error);
      }
    } else {
        console.log(`User with ID ${room} is not currently online.`);
    }
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    // You might want to remove the user from userSocketmap here
    for (const key in userSocketmap) {
        if (userSocketmap[key] === socket.id) {
            delete userSocketmap[key];
            break;
        }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running.");
});

connectDb().then(() => {
  server.listen(4000, () => {
    console.log('Server listening at 4000');
  });
});
