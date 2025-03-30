import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sword, Trophy, LogIn, Menu, X } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/debates" className="nav-link group">
              <Sword className="w-4 h-4 mr-2" />
              <span>Debates</span>
              <div className={`nav-link-underline ${location.pathname === '/debates' ? 'w-full opacity-100' : ''}`} />
            </Link>

            <Link to="/leaderboard" className="nav-link group">
              <Trophy className="w-4 h-4 mr-2" />
              <span>Leaderboard</span>
              <div className={`nav-link-underline ${location.pathname === '/leaderboard' ? 'w-full opacity-100' : ''}`} />
            </Link>
          </div>

          {/* Sign-in Button (Web3 Removed) */}
          <div className="hidden md:flex items-center">
            <Link to="/connect" className="arcade-button-sm">
              <span className="flex items-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              {isMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-black/50 backdrop-blur-lg">
          <Link to="/debates" className="block px-4 py-2 text-gray-100 hover:bg-gray-700 rounded-md">
            <Sword className="w-4 h-4 mr-2 inline" />
            Debates
          </Link>
          <Link to="/leaderboard" className="block px-4 py-2 text-gray-100 hover:bg-gray-700 rounded-md">
            <Trophy className="w-4 h-4 mr-2 inline" />
            Leaderboard
          </Link>
          <Link to="/connect" className="block w-full px-4 py-3 mt-4 text-center bg-emerald-500 text-white rounded-md hover:bg-emerald-600">
            <LogIn className="w-4 h-4 mr-2 inline" />
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
