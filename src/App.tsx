import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Debates from './pages/Debates';
import Leaderboard from './pages/Leaderboard';
import DebateRoom from './pages/DebateRoom';
import socket from './pages/socket';


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
          <Route path="/" element={<Home />} />
          <Route path="/debates" element={<Debates />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        
          <Route path="/debate-room/:id" element={<DebateRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

