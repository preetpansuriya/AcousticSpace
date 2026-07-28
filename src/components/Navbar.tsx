import React from 'react';
import { Activity, Database, History, FileText, HelpCircle, ArrowLeftRight, Mic, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiActive?: boolean;
  historyCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount = 0
}) => {
  const navItems = [
    { id: 'home', label: 'Main Portal', icon: LayoutGrid },
    { id: 'dashboard', label: 'Forensic Inspector', icon: Activity },
    { id: 'live-mic', label: 'Live Mic Inspection', icon: Mic },
    { id: 'compare', label: 'Dual Inspector', icon: ArrowLeftRight },
    { id: 'benchmarks', label: 'DFBench Suite', icon: Database },
    { id: 'history', label: 'Analysis History', icon: History, badge: historyCount },
    { id: 'reports', label: 'Forensic Reports', icon: FileText },
    { id: 'docs', label: 'Physics Architecture', icon: HelpCircle },
  ];

  return (
    <header id="main-navbar" className="glass-panel sticky top-0 z-40 px-4 py-3 flex flex-col lg:flex-row items-center justify-between border-b border-white/15 text-slate-100 backdrop-blur-2xl gap-3">
      {/* Logo & Brand */}
      <div className="flex items-center space-x-3 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                AcousticSpace
              </h1>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 font-bold backdrop-blur-md">
                3D Forensics
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Audio Deepfake Detection & Environmental Reverb Forensic Suite
            </p>
          </div>
        </div>
      </div>

      {/* Top 3D Module Navigation Buttons */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/15 overflow-x-auto max-w-full shadow-inner">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 border-cyan-400/50 scale-102'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

