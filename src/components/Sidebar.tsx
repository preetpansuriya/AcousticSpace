import React from 'react';
import { motion } from 'motion/react';
import { Activity, Database, History, FileText, ShieldAlert, BookOpen, ArrowLeftRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, historyCount }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Forensic Inspector',
      icon: Activity,
      description: 'Audio upload, RIR analyzer & waveform'
    },
    {
      id: 'compare',
      label: 'A/B Dual Inspector',
      icon: ArrowLeftRight,
      description: 'Side-by-side voice & RIR delta'
    },
    {
      id: 'benchmarks',
      label: 'DFBench Test Suite',
      icon: Database,
      description: 'HuggingFace Speech25 & ASVspoof'
    },
    {
      id: 'history',
      label: 'Analysis History',
      icon: History,
      badge: historyCount,
      description: 'Saved forensic reports & logs'
    },
    {
      id: 'reports',
      label: 'Forensic Reports',
      icon: FileText,
      description: 'Security briefs & threat exports'
    },
    {
      id: 'docs',
      label: 'Physics Architecture',
      icon: BookOpen,
      description: 'RIR math, RT60 & AST Transformer'
    }
  ];

  return (
    <aside id="main-sidebar" className="w-64 glass-panel border-r border-white/10 text-slate-300 flex flex-col justify-between shrink-0 p-4 min-h-[calc(100vh-65px)] backdrop-blur-xl">
      <div className="space-y-6">
        {/* Section Heading */}
        <div className="px-2">
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-400/80">
            Forensic Workstation
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 relative">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-start space-x-3 group relative ${
                  isActive
                    ? 'glass-3d-button text-white shadow-xl border border-white/30 ring-1 ring-cyan-400/30'
                    : 'hover:bg-white/10 hover:text-slate-100 text-slate-300 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveGlow"
                    className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-sm -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}

                <div className={`p-2 rounded-xl shrink-0 mt-0.5 transition-all ${
                  isActive ? 'bg-white/20 text-white shadow-inner' : 'bg-white/5 text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300 border border-white/10'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-cyan-100 font-medium' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Physics Tech Badge */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2.5">
        <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold">
          <ShieldAlert className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>Infotact Forensics</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
          Analyzing environmental audio physics & RIR wall reflections rather than vulnerable vocal biometrics.
        </p>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-medium">AST PyTorch Pipeline</span>
          <span className="text-emerald-400 font-mono font-bold">RT60 & EDT</span>
        </div>
      </div>
    </aside>
  );
};
