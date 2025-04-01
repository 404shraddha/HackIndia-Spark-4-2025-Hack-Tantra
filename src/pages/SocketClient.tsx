import { io } from "socket.io-client";

// Correct connection URL without trailing slash
const socket = io("http://localhost:5173");

export default socket;
