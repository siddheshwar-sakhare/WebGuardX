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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-32 pb-20">
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Developer Hub</h1>
          <p className="text-slate-500 text-lg">Manage API keys, configure webhooks, and integrate WebGuardX into your pipelines.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* API Keys Panel (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <Key className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Production API Keys</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Use these keys to authenticate headless scan requests.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-700">Default API Key</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Active Status</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      readOnly 
                      value={apiKey}
                      className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-emerald-600 font-mono font-bold focus:outline-none shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors flex items-center justify-center min-w-[3rem] shadow-sm"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={generateNewKey}
                    className="flex items-center justify-center gap-2 px-6 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors font-bold shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Roll Key
                  </button>
                </div>
                <p className="mt-3 text-xs font-medium text-amber-600">Warning: Rolling the key will immediately revoke access for all CI/CD pipelines currently using it.</p>
              </div>
            </div>

            {/* Quickstart Code - Keeps dark theme as it's a code block */}
            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <TerminalSquare className="w-5 h-5 text-slate-300" />
                </div>
                <h2 className="text-xl font-bold text-white">cURL Quickstart</h2>
              </div>
              <div className="bg-[#030712] border border-slate-800/50 rounded-xl p-5 font-mono text-sm overflow-x-auto text-slate-300 leading-relaxed shadow-inner">
                <span className="text-pink-400">curl</span> -X POST https://api.webguardx.com/v1/scans \<br/>
                &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer {apiKey}"</span> \<br/>
                &nbsp;&nbsp;-H <span className="text-emerald-400">"Content-Type: application/json"</span> \<br/>
                &nbsp;&nbsp;-d <span className="text-amber-300">'&#123;"target": "https://example.com"&#125;'</span>
              </div>
            </div>
          </div>

          {/* Webhooks Panel */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <Webhook className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Automation Webhooks</h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Slack / Discord URL</label>
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Event Triggers</label>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm font-semibold text-slate-700">Scan Started</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm font-semibold text-slate-700">Scan Completed</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm font-bold text-red-600">High-Risk Vulnerability Found</span>
                    </label>
                  </div>
                </div>

                <button className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-lg">
                  Save Configuration
                </button>
                
                <div className="pt-5 border-t border-slate-100 flex justify-center">
                  <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors">
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
