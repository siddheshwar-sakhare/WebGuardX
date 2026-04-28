import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Shield, Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:1002/signup";
  };

  return (
    <>
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
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="group relative px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5 pl-4 border-l border-slate-200">
                <Link
                  to="/scanners"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Scanner Suite
                </Link>
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
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="text-left text-base font-medium text-slate-600 hover:text-slate-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full px-5 py-3 bg-slate-900 text-white font-medium rounded-lg text-center"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link
                  to="/scanners"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-600 hover:text-slate-900"
                >
                  Scanner Suite
                </Link>
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-fade-in-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 mt-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto mb-5 border border-indigo-100 shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in securely to your WebGuardX account</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
            
            <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed font-medium">
              By clicking continue, you agree to our <br/>
              <span className="text-slate-500 underline cursor-pointer hover:text-indigo-600">Terms of Service</span> and <span className="text-slate-500 underline cursor-pointer hover:text-indigo-600">Privacy Policy</span>.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;