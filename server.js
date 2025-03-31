import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Set up Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ["*", "https://webprog-kappa.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Express Route (For Testing)
app.get("/", (req, res) => {
  res.send("Backend Server is running with Express!");
});

// Set up WebSocket events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join:room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("player:play", (time, roomId) => {
    socket.to(roomId).emit("player:play", time);
    console.log(`Broadcasting play event to room ${roomId} at time ${time}`);
  });

  socket.on("player:pause", (time, roomId) => {
    socket.to(roomId).emit("player:pause", time);
    console.log(`Broadcasting pause event to room ${roomId} at time ${time}`);
  });

  socket.on("player:seek", (time, roomId) => {
    socket.to(roomId).emit("player:seek", time);
    console.log(`Broadcasting seek event to room ${roomId} at time ${time}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
httpServer.listen(port, () => {
  console.log(`> Backend server running at http://localhost:${port}`);
});
