import { createServer } from "node:http";
import { Server } from "socket.io";

const hostname = "localhost";
const port = 3000;

// Create a basic HTTP server that will serve as the backend
const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Backend Server is running!");
});

// Set up Socket.IO with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: ["*", "https://webprog-kappa.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Set up WebSocket events for video playback synchronization
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a room for the current video
  socket.on("join:room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Broadcast play event to all other clients in the same room
  socket.on("player:play", (time, roomId) => {
    socket.to(roomId).emit("player:play", time);
    console.log(`Broadcasting play event to room ${roomId} at time ${time}`);
  });

  // Broadcast pause event to all other clients in the same room
  socket.on("player:pause", (time, roomId) => {
    socket.to(roomId).emit("player:pause", time);
    console.log(`Broadcasting pause event to room ${roomId} at time ${time}`);
  });

  // Broadcast seek event to all other clients in the same room
  socket.on("player:seek", (time, roomId) => {
    socket.to(roomId).emit("player:seek", time);
    console.log(`Broadcasting seek event to room ${roomId} to time ${time}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the HTTP server and listen on port
httpServer.listen(port, hostname, () => {
  console.log(`> Backend server running at http://${hostname}:${port}`);
});
