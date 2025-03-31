const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
import type {Socket} from 'socket.io';
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // This is ignored if requests come from the same origin
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket:Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", (data: string) => {
        console.log("Message received:", data);
        socket.broadcast.emit("message", data); // Send message to all clients except sender
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

app.use(express.static('public'));
Server.listen(5173, () => console.log("Server started at 5173"));
