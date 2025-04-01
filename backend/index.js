const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const debateRoutes = require("./routes/debateRoutes");
const judgementRoutes = require("./routes/judgementRoutes");
const rewardsRoutes = require("./routes/rewardsRoute");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP server for WebSocket
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow frontend
    methods: ["GET", "POST"],
  },
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Server connected to MongoDB...");
  } catch (error) {
    console.error("❌ Server failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process on DB failure
  }
};

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.get("/", (req, res) => {
  console.log("✅ API is running...");
  res.send("🚀 API is running successfully!");
});

app.use("/user", userRoutes);
app.use("/debate", debateRoutes);
app.use("/judgement", judgementRoutes);
app.use("/rewards", rewardsRoutes);

// WebSocket connection
io.on("connection", (socket) => {
  console.log(`🔵 A user connected: ${socket.id}`);

  // Handling user joining a debate room
  socket.on("join_debate", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId); // Get room details
    const numUsers = room ? room.size : 0; // Count users in room

    if (numUsers < 2) {
      socket.join(roomId); // Join the room
      console.log(`User ${socket.id} joined debate room: ${roomId}`);
      io.to(roomId).emit("room_update", { message: "A new user has joined!" });
    } else {
      socket.emit("room_full", { message: "Room is already full!" });
      console.log(`❌ User ${socket.id} denied entry to full room: ${roomId}`);
    }
  });

  // Handling message send event
  socket.on("send_message", (data) => {
    console.log(`📩 Message received for room ${data.room}: ${data.message}`);
    io.to(data.room).emit("receive_message", {
      message: data.message,
      sender: data.sender,
    }); // Send message to users in the specific room
  });

  // Handling user disconnection
  socket.on("disconnect", () => {
    console.log(`🔴 A user disconnected: ${socket.id}`);
    io.emit("user-disconnected", { id: socket.id });
  });
});

// Start server
const PORT = process.env.PORT || 5100;
server.listen(PORT, () =>
  console.log(`🚀 Server is running on port ${PORT}...`)
);
