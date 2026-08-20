import React from 'react';
import { Activity, Database, History, FileText, HelpCircle, ArrowLeftRight, Mic, LayoutGrid, Layers, Sliders, Sun, Moon, User, LogIn, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiActive?: boolean;
  historyCount?: number;
  customBrandingName?: string;
  onOpenBulkScanner?: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  currentUser?: { email?: string; isGuest?: boolean } | null;
  onOpenHowItWorks?: () => void;
  themeMode?: string;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount = 0,
  customBrandingName = 'AcousticSpace',
  onOpenBulkScanner,
  onOpenSettings,
  onOpenAuth,
  currentUser,
  onOpenHowItWorks,
  themeMode = 'cyberpunk',
  onToggleTheme
}) => {
  const navItems = [
    { id: 'home', label: 'Main Portal', icon: LayoutGrid },
    { id: 'dashboard', label: 'Forensic Analysis', icon: Activity },
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
                {customBrandingName}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Audio Deepfake Detection & Environmental Reverb Forensic Suite
            </p>
          </div>
        </div>

        {/* Quick Action Utility Buttons */}
        <div className="flex items-center space-x-2">
          {onOpenHowItWorks && (
            <button
              onClick={onOpenHowItWorks}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm cursor-pointer active:scale-95"
              title="How It Works Pipeline"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 bg-white/10 hover:bg-white/15 text-amber-300 rounded-xl border border-white/15 cursor-pointer active:scale-95 transition-all"
              title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Luxury Light Mode'}
            >
              {themeMode === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          )}

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border cursor-pointer active:scale-95 transition-all ${
                currentUser
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">
                {currentUser?.email ? currentUser.email.split('@')[0] : 'Login / Sign In'}
              </span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 bg-white/10 hover:bg-white/15 text-amber-300 rounded-xl border border-white/15 cursor-pointer active:scale-95"
              title="Engine & Threshold Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Module Navigation: Hidden on Main Portal (home), shows "Back to Main Portal" button when inside any module */}
      {activeTab !== 'home' && (
        <div className="flex items-center space-x-2">
          <button
            id="nav-btn-back-home"
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 border border-cyan-400/50 cursor-pointer transition-all active:scale-95"
          >
            <LayoutGrid className="w-4 h-4 text-cyan-200" />
            <span>← Back to Main Portal</span>
          </button>
        </div>
      )}
    </header>
  );
};
