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

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Server connected to MongoDB...");
  } catch (error) {
    console.error("Server failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  console.log(" API is running...");
  res.send("API is running successfully...");
});

app.use("/user", userRoutes);
app.use("/debate", debateRoutes);
app.use("/judgement", judgementRoutes);
app.use("/rewards", rewardsRoutes);

const debateRooms = {};

io.on("connection", (socket) => {
  console.log(` A user connected: ${socket.id}`);

  socket.on("join_debate", ({ roomId, username }) => {
    if (!debateRooms[roomId]) {
      debateRooms[roomId] = [];
    }

    const usersInRoom = debateRooms[roomId];

    if (usersInRoom.length < 2) {
      usersInRoom.push({ id: socket.id, name: username });
      socket.join(roomId);
      console.log(` ${username} (${socket.id}) joined room ${roomId}`);

      io.to(roomId).emit("room_update", {
        message: `${username} has joined!`,
        users: usersInRoom.map((user) => user.name),
      });
    } else {
      socket.emit("room_full", { message: "Room is already full!" });
      console.log(` ${username} denied entry to full room: ${roomId}`);
    }
  });

  socket.on("send_message", ({ room, message, sender }) => {
    const usersInRoom = debateRooms[room] || [];
    const isUserInRoom = usersInRoom.some((user) => user.id === socket.id);

    if (isUserInRoom) {
      console.log(` ${sender}: ${message} in room ${room}`);
      io.to(room).emit("receive_message", { message, sender });
    } else {
      socket.emit("not_allowed", {
        message: "You are not in this debate room!",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(` User disconnected: ${socket.id}`);

    for (const roomId in debateRooms) {
      const usersInRoom = debateRooms[roomId];
      const index = usersInRoom.findIndex((user) => user.id === socket.id);

      if (index !== -1) {
        const disconnectedUser = usersInRoom.splice(index, 1)[0];
        io.to(roomId).emit("room_update", {
          message: `${disconnectedUser.name} has left the debate.`,
          users: usersInRoom.map((user) => user.name),
        });

        if (usersInRoom.length === 0) {
          delete debateRooms[roomId];
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5100;
server.listen(PORT, () => console.log(` Server is running on port ${PORT}...`));
