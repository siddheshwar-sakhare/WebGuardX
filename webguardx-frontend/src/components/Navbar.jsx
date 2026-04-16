import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Shield, Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
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
      className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm"
          : "bg-white/0 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md group-hover:bg-indigo-700 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            WebGuardX
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>

          {!isLoggedIn ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="group relative px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-5 pl-4 border-l border-slate-200">
              <Link
                to="/history"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                History
              </Link>
              <Link
                to="/developer"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Developer
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Settings
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-slate-900"
          >
            Home
          </Link>

          {!isLoggedIn ? (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-600 hover:text-slate-900"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-5 py-3 bg-slate-900 text-white font-medium rounded-lg text-center"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                to="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-600 hover:text-slate-900"
              >
                History
              </Link>
              <Link
                to="/developer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-600 hover:text-slate-900"
              >
                Developer
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg text-center"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-base font-medium text-slate-600 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;