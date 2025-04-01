import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);  // Create the server using the 'http' module
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow requests from any origin (make sure frontend is on the same or allowed domain)
        methods: ["GET", "POST"]
    }
});

// WebSocket connection handler
io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    // Handle incoming messages
    socket.on("message", (data: string) => {
        console.log("Message received:", data);
        socket.broadcast.emit("message", data);  // Broadcast message to all clients except sender
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server on port 5173
server.listen(5173, () => {
    console.log("Server started at port 5173");
});
