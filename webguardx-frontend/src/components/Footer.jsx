import { Shield, Github, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      {/* Top CTA Section */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center md:flex md:items-center md:justify-between md:text-left">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ready to fortify your web applications?</h3>
            <p className="text-slate-500 mt-2 text-lg">Join forward-thinking teams securing their infrastructure.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/signup" 
              className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Start Scanning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">WebGuardX</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
              Enterprise vulnerability scanning made accessible. Protecting modern web applications from tomorrow's threats with AI-driven DAST engines.
            </p>
            <div className="flex gap-4 text-slate-400">
              <a href="https://github.com/siddheshwar-sakhare" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 bg-slate-50 p-2 rounded-lg border border-slate-100 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 bg-slate-50 p-2 rounded-lg border border-slate-100 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 bg-slate-50 p-2 rounded-lg border border-slate-100 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 font-bold mb-3 text-sm uppercase tracking-wider">Product</h4>
            <Link to="/dashboard" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Dashboard</Link>
            <Link to="/zap-scan" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">New Scan</Link>
            <Link to="/history" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Scan History</Link>
            <Link to="/developer" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Developer API</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 font-bold mb-3 text-sm uppercase tracking-wider">Account</h4>
            <Link to="/login" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Sign In</Link>
            <Link to="/signup" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Create Account</Link>
            <Link to="/settings" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Settings</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 font-bold mb-3 text-sm uppercase tracking-wider">Legal</h4>
            <Link to="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Privacy Policy</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Terms of Service</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Cookie Policy</Link>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} WebGuardX. Built with Spring Boot & React.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
