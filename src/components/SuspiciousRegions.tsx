import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle, ChevronRight, Filter } from 'lucide-react';
import { AcousticAnomaly } from '../types';

interface SuspiciousRegionsProps {
  anomalies: AcousticAnomaly[];
  onSeekTimestamp?: (seconds: number) => void;
}

export const SuspiciousRegions: React.FC<SuspiciousRegionsProps> = ({ anomalies, onSeekTimestamp }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredAnomalies = anomalies.filter((a) => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  return (
    <div className="p-5 glass-card rounded-2xl border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Suspicious Regions & Anomalies</h3>
            <p className="text-[11px] text-slate-400">
              {anomalies.length} flagged timestamps requiring forensic inspection
            </p>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      {filteredAnomalies.length === 0 ? (
        <div className="p-6 text-center text-slate-400 space-y-2 bg-slate-900/40 rounded-xl border border-white/5">
          <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
          <p className="text-xs font-bold text-slate-200">No suspicious regions flagged for this severity filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredAnomalies.map((anom, idx) => (
            <div
              key={anom.id || idx}
              onClick={() => onSeekTimestamp && onSeekTimestamp(anom.timestampStart)}
              className="p-3.5 bg-slate-900/60 hover:bg-slate-900/90 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`mt-0.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border backdrop-blur-md flex items-center space-x-1 ${
                    anom.severity === 'CRITICAL'
                      ? 'bg-red-500/10 text-red-300 border-red-500/30'
                      : anom.severity === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {anom.timestampStart.toFixed(1)}s - {anom.timestampEnd.toFixed(1)}s
                </span>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-100">{anom.type.replace('_', ' ')}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({(anom.timestampEnd - anom.timestampStart).toFixed(1)}s duration)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{anom.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-2">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Confidence</span>
                  <span className="text-xs font-mono font-extrabold text-cyan-400">{anom.confidence}%</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 border border-white/5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
