import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sword,
  Trophy,
  LogIn,
  Menu,
  X,
  User,
  LogOut,
  Coins,
} from "lucide-react";
import axios from "axios";

interface User {
  name: string;
  coins: number;
  debatesWon: number;
  debatesLost: number;
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await axios.get("http:localhost:5100/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };

    fetchProfile();
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link group">
              Home
            </Link>
            <Link to="/debates" className="nav-link group">
              <Sword className="w-4 h-4 mr-2" />
              <span>Debates</span>
            </Link>
            <Link to="/leaderboard" className="nav-link group">
              <Trophy className="w-4 h-4 mr-2" />
              <span>Leaderboard</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="flex items-center space-x-4 text-white">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {user.name}
                    </span>
                    <span className="flex items-center">
                      <Coins className="w-4 h-4 mr-1" />
                      {user.coins} Coins
                    </span>
                    <span className="flex items-center">
                      🏆 {user.debatesWon} Wins / ❌ {user.debatesLost} Losses
                    </span>
                  </div>
                )}

                <Link
                  to="/profile"
                  className="arcade-button-sm flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="arcade-button-sm flex items-center white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="arcade-button-sm flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="arcade-button-sm flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-emerald-400" />
              ) : (
                <Menu className="w-6 h-6 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black p-4">
            <Link to="/" className="block py-2">
              Home
            </Link>
            <Link to="/debates" className="block py-2">
              Debates
            </Link>
            <Link to="/leaderboard" className="block py-2">
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2">
                  Login
                </Link>
                <Link to="/signup" className="block py-2">
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
