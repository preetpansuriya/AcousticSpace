import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { ForensicReport } from '../types';

interface VerdictBannerProps {
  report: ForensicReport;
  onOpenExportModal: () => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ report, onOpenExportModal }) => {
  const isSpoof = report.verdict === 'DEEPFAKE_SPOOF';
  const isSuspicious = report.verdict === 'SUSPICIOUS_SYNTHETIC';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`glass-3d-card rounded-3xl p-6 border shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all ${
        isSpoof
          ? 'border-red-500/50 glass-glow-rose'
          : isSuspicious
          ? 'border-amber-500/50'
          : 'border-emerald-500/50 glass-glow-emerald'
      }`}
    >
      {/* Background Accent Glow & Specular Lighting Reflection */}
      <div className={`absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse ${
        isSpoof ? 'bg-red-500' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-500'
      }`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none rounded-3xl" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Verdict Section */}
        <div className="flex items-start space-x-4">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className={`p-4 rounded-2xl shrink-0 flex items-center justify-center shadow-2xl backdrop-blur-xl ring-2 ${
              isSpoof
                ? 'bg-red-500/15 border border-red-500/50 text-red-400 ring-red-500/30 animate-pulse shadow-red-500/20'
                : isSuspicious
                ? 'bg-amber-500/15 border border-amber-500/50 text-amber-400 ring-amber-500/30 shadow-amber-500/20'
                : 'bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 ring-emerald-500/30 shadow-emerald-500/20'
            }`}
          >
            {isSpoof ? (
              <ShieldAlert className="w-10 h-10 drop-shadow-md" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-10 h-10 drop-shadow-md" />
            ) : (
              <ShieldCheck className="w-10 h-10 drop-shadow-md" />
            )}
          </motion.div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <span className={`text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border backdrop-blur-md shadow-md ${
                isSpoof
                  ? 'bg-red-500/20 text-red-300 border-red-500/50'
                  : isSuspicious
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}>
                {report.verdict.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-300 font-mono font-medium glass-pill px-2.5 py-0.5 rounded-full border border-white/10">
                Scan ID: {report.id}
              </span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {isSpoof ? 'Synthetic Audio / Deepfake Detected' : isSuspicious ? 'Suspicious Synthetic Splicing Detected' : 'Authentic Human Speech Verified'}
            </h1>

            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed font-medium">
              {report.summaryExplanation}
            </p>
          </div>
        </div>

        {/* Right Metric Gauges & Action Button */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 shrink-0">
          {/* Deepfake Probability Score */}
          <motion.div
            whileHover={{ y: -4, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="glass-3d-card rounded-2xl p-3.5 border border-white/15 min-w-[130px] text-center shadow-lg"
          >
            <p className="text-[10px] uppercase font-extrabold text-slate-300 tracking-wider">Deepfake Risk</p>
            <p className={`text-2xl font-black font-mono mt-0.5 drop-shadow ${
              isSpoof ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {report.overallDeepfakeProbability}%
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">AST Transformer</p>
          </motion.div>

          {/* RIR Reflection Mismatch Score */}
          <motion.div
            whileHover={{ y: -4, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="glass-3d-card rounded-2xl p-3.5 border border-white/15 min-w-[130px] text-center shadow-lg"
          >
            <p className="text-[10px] uppercase font-extrabold text-slate-300 tracking-wider">RIR Mismatch</p>
            <p className={`text-2xl font-black font-mono mt-0.5 drop-shadow ${
              report.rir.reflectionMismatchScore > 50 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {report.rir.reflectionMismatchScore}%
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">RT60: {report.rir.rt60Seconds}s</p>
          </motion.div>

          {/* Breathing Cadence Score */}
          <motion.div
            whileHover={{ y: -4, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="glass-3d-card rounded-2xl p-3.5 border border-white/15 min-w-[130px] text-center shadow-lg"
          >
            <p className="text-[10px] uppercase font-extrabold text-slate-300 tracking-wider">Breath Cadence</p>
            <p className={`text-2xl font-black font-mono mt-0.5 drop-shadow ${
              report.breathing.cadenceSynchronyScore < 50 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {report.breathing.cadenceSynchronyScore}%
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{report.breathing.detectedBreathsCount} Breaths</p>
          </motion.div>

          {/* Export Report Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="btn-export-report-banner"
            onClick={onOpenExportModal}
            className="w-full sm:w-auto px-5 py-3 glass-3d-button text-white font-black text-xs rounded-2xl flex items-center justify-center space-x-2 shadow-xl shrink-0 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Brief</span>
          </motion.button>
        </div>
      </div>

      {/* Analyst Action Box */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-slate-200">Recommended SOC Action:</span>
          <span className={`font-semibold ${isSpoof ? 'text-red-300' : isSuspicious ? 'text-amber-300' : 'text-emerald-300'}`}>
            {report.recommendedAction}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono font-medium">
          Analyzed {report.fileName} ({report.durationSeconds}s)
        </div>
      </div>
    </motion.div>
  );
};
