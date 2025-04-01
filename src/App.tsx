import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Debates from "./pages/Debates";
import Leaderboard from "./pages/Leaderboard";
import DebateRoom from "./pages/DebateRoom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";
import socket from "./pages/socket"; // Import the socket client

const App = () => {
  useEffect(() => {
    // Establish the socket connection when the component mounts
    socket.connect();

    // Handle successful connection event
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    // Handle socket connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Listen for incoming messages
    socket.on("message", (data: any) => {
      console.log("Received message:", data);
    });

    // Cleanup: Disconnect from the socket server when the component unmounts
    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Disconnected from server with ID:", socket.id);
      }
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0b1e] text-gray-100">
        <Navbar /> {/* Navbar component */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes (Protected by PrivateRoute) */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/debates"
            element={
              <PrivateRoute>
                <Debates />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/debate-room/:id"
            element={
              <PrivateRoute>
                <DebateRoom />
              </PrivateRoute>
            }
          />

          {/* Catch-All Route (Redirects to Home if URL doesn't match any route) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
