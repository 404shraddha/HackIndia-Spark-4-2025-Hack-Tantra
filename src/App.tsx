import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Debates from './pages/Debates';
import Leaderboard from './pages/Leaderboard';
import DebateRoom from './pages/DebateRoom';

function App() {
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

