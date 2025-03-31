import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Debates from "./pages/Debates";
import Leaderboard from "./pages/Leaderboard";
import DebateRoom from "./pages/DebateRoom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute"; // ✅ Protected Route

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0b1e] text-gray-100">
        <Navbar /> {/* Navbar hamesha visible rahega */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debates" element={<Debates />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Protected Route */}
          <Route
            path="/debate-room/:id"
            element={
              <PrivateRoute>
                <DebateRoom />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
