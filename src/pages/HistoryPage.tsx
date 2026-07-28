import React, { useState } from 'react';
import { History, Search, Trash2, Eye } from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

interface HistoryPageProps {
  historyItems: AnalysisHistoryItem[];
  onSelectReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  historyItems,
  onSelectReport,
  onDeleteReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');

  const filtered = historyItems.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict = filterVerdict === 'ALL' || item.verdict === filterVerdict;
    return matchesSearch && matchesVerdict;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white">Forensic Analysis History Log</h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search audio tracks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 text-xs text-slate-100 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-cyan-400 backdrop-blur-lg font-sans"
              />
            </div>

            {/* Verdict Filter */}
            <select
              value={filterVerdict}
              onChange={e => setFilterVerdict(e.target.value)}
              className="bg-slate-900/90 border border-white/15 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-400 font-sans backdrop-blur-lg cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-100">All Verdicts</option>
              <option value="DEEPFAKE_SPOOF" className="bg-slate-900 text-slate-100">Deepfake Spoofs</option>
              <option value="AUTHENTIC" className="bg-slate-900 text-slate-100">Authentic Human</option>
              <option value="SUSPICIOUS_SYNTHETIC" className="bg-slate-900 text-slate-100">Suspicious Spliced</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table / Cards */}
      <div className="glass-panel rounded-3xl p-3 shadow-2xl border border-white/10 backdrop-blur-2xl overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No analysis history records match your search query.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                <th className="p-3.5">Track Name</th>
                <th className="p-3.5">Verdict</th>
                <th className="p-3.5">Deepfake Risk</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(item => {
                const isSpoof = item.verdict === 'DEEPFAKE_SPOOF';
                const isSuspicious = item.verdict === 'SUSPICIOUS_SYNTHETIC';
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-all text-slate-200">
                    <td className="p-3.5 font-bold text-slate-100">
                      {item.fileName} <span className="text-slate-400 font-mono font-normal">({item.duration}s)</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono backdrop-blur-md border ${
                        isSpoof
                          ? 'bg-red-500/10 text-red-300 border-red-500/30'
                          : isSuspicious
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {item.verdict.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`p-3.5 font-mono font-extrabold ${
                      isSpoof ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.deepfakeProb}%
                    </td>
                    <td className="p-3.5 uppercase text-[10px] font-mono text-slate-400 font-medium">
                      {item.sourceType}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectReport(item.id)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-xl font-bold transition-all inline-flex items-center space-x-1 shadow-md shadow-cyan-500/10 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onDeleteReport(item.id)}
                        className="p-1.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 rounded-xl border border-white/10 transition-all active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
