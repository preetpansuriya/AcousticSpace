import React from 'react';
import { Card3D } from './Card3D';
import { History, FileAudio, ExternalLink } from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelectReport: (reportId: string) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  history,
  onSelectReport,
}) => {
  return (
    <Card3D glowColor="purple" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase font-mono flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          Recent Forensics Scan History
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          {history.length} Logs Saved
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-6">
            No previous scans logged yet.
          </p>
        ) : (
          history.map((item) => {
            const isFake = item.verdict === 'DEEPFAKE_DETECTED';
            return (
              <div
                key={item.id}
                onClick={() => onSelectReport(item.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isFake ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <FileAudio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {item.filename}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                      isFake
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isFake ? 'DEEPFAKE' : 'AUTHENTIC'}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card3D>
  );
};
