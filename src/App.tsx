import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Debates from "./pages/Debates";
import Leaderboard from "./pages/Leaderboard";
import DebateRoom from "./pages/DebateRoom";
import socket from "./pages/socket";

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
import PrivateRoute from "./pages/PrivateRoute"; // ✅ Import PrivateRoute

function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });
    socket.on("message", (data) => {
      console.log("Received message:", data);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from server with ID:", socket.id);
    };
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0b1e] text-gray-100">
        <Navbar />

        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔥 Private Routes (Protected by PrivateRoute) */}
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

          {/* ✅ Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
