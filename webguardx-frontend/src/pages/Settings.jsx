import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { User, Bell, Shield as ShieldIcon, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-200 font-sans selection:bg-neonPurple selection:text-white pt-24">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-neonPurple/10 to-transparent opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your profile, security preferences, and notifications.</p>
        </div>

        <div className="space-y-8">
          
          {/* Profile Section */}
          <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
              <User className="w-6 h-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Security Administrator"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:border-neonBlue transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Main Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@webguardx.local"
                  readOnly
                  className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 px-4 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium border border-gray-700">
                <Save className="w-4 h-4" />
                Update Profile
              </button>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
              <ShieldIcon className="w-6 h-6 text-neonRed" />
              <h2 className="text-2xl font-bold text-white">Security</h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-900/40 rounded-xl border border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account using an authenticator app.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neonRed"></div>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
              <Bell className="w-6 h-6 text-neonBlue" />
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-900/40 rounded-xl border border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Weekly Scan Report Email</h3>
                <p className="text-sm text-gray-500">Receive a weekly summary of all scans completed by WebGuardX.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neonBlue"></div>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
            <p className="text-gray-400 mb-6 text-sm">Actions performed here are permanent and cannot be undone.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-xl border border-red-500/30 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of All Sessions
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
