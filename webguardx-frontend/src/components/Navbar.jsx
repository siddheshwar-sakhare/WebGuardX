import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  
useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
  className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 ${
    scrolled
      ? "bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200"
      : "bg-transparent"
  }`}
>

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            WebGuardX
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105 transform"
          >
            Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
          >
            Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg text-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg text-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;