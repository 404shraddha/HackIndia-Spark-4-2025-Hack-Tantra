import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5100"; // Corrected to backend port

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false, // Prevent auto-connection
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Retry 5 times
  transports: ["websocket"], // Use WebSocket for better performance
});

export default socket;
