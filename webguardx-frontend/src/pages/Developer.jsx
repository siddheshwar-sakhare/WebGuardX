import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Key, Webhook, Copy, RefreshCw, CheckCircle2, Bot, TerminalSquare } from "lucide-react";

const Developer = () => {
  const [apiKey, setApiKey] = useState("wgx_live_9f8a8b7c6d5e");
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://discord.com/api/webhooks/...");
  const [webhookStatus, setWebhookStatus] = useState("active");

  const generateNewKey = () => {
    setApiKey(`wgx_live_${Math.random().toString(36).substring(2, 14)}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-200 font-sans selection:bg-neonRed selection:text-white pt-24">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-neonRed/10 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-neonBlue/10 to-transparent opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Developer Hub</h1>
          <p className="text-gray-400">Manage API keys, configure webhooks, and integrate WebGuardX into your CI/CD pipelines.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* API Keys Panel (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-neonRed/10 rounded-xl border border-neonRed/20">
                  <Key className="w-6 h-6 text-neonRed" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Production API Keys</h2>
                  <p className="text-sm text-gray-400">Use these keys to authenticate headless scan requests.</p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-300">Default API Key</span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Active</span>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      readOnly 
                      value={apiKey}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg py-3 px-4 text-neonRed font-mono focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg transition-colors flex items-center justify-center min-w-[3rem]"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={generateNewKey}
                    className="flex items-center gap-2 px-6 bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-500/30 rounded-lg transition-colors font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Roll Key
                  </button>
                </div>
                <p className="mt-3 text-xs text-yellow-500/80">Warning: Rolling the key will immediately revoke access for all applications using the old key.</p>
              </div>
            </div>

            {/* Quickstart Code */}
            <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                  <TerminalSquare className="w-6 h-6 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-white">cURL Quickstart</h2>
              </div>
              <div className="bg-[#0a0f1c] border border-gray-800 rounded-xl p-4 font-mono text-sm overflow-x-auto text-gray-300">
                <span className="text-pink-500">curl</span> -X POST https://api.webguardx.com/v1/scans \<br/>
                &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer {apiKey}"</span> \<br/>
                &nbsp;&nbsp;-H <span className="text-green-400">"Content-Type: application/json"</span> \<br/>
                &nbsp;&nbsp;-d <span className="text-yellow-300">'&#123;"target": "https://example.com"&#125;'</span>
              </div>
            </div>
          </div>

          {/* Webhooks Panel */}
          <div className="space-y-8">
            <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-neonBlue/10 rounded-xl border border-neonBlue/20">
                  <Webhook className="w-6 h-6 text-neonBlue" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Webhooks</h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Slack / Discord Endpoint URL</label>
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:border-neonBlue transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Event Triggers</label>
                  <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/80 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-neonBlue focus:ring-neonBlue focus:ring-offset-gray-900" />
                      <span className="text-sm text-gray-300">Scan Started</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-neonBlue focus:ring-neonBlue focus:ring-offset-gray-900" />
                      <span className="text-sm text-gray-300">Scan Completed</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-neonBlue focus:ring-neonBlue focus:ring-offset-gray-900" />
                      <span className="text-sm text-gray-300">High-Risk Vulnerability Found</span>
                    </label>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  Save Webhook
                </button>
                
                <div className="pt-4 border-t border-gray-800 flex justify-center">
                  <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <Bot className="w-4 h-4" /> Send Test Payload
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Developer;
