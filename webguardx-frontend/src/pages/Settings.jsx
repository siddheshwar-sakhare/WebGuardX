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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Account Settings</h1>
          <p className="text-slate-500 text-lg">Manage your profile, security preferences, and notifications.</p>
        </div>

        <div className="space-y-6">
          
          {/* Profile Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <User className="w-6 h-6 text-slate-400" />
              <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Security Administrator"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors shadow-sm inset-shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Main Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@webguardx.local"
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>
            <div className="mt-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors font-medium shadow-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <ShieldIcon className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900">Security</h2>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account using an authenticator app.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <Bell className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900">Email Notifications</h2>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Weekly Scan Report</h3>
                <p className="text-sm text-slate-500 mt-1">Receive a weekly summary of all scans completed and resources mapped.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-red-500/80 mb-6 text-sm font-medium">Actions performed here are permanent and cannot be undone.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-xl border border-red-200 transition-colors font-semibold shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out / Purge Session
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
