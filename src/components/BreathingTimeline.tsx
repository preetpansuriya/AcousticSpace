import React from 'react';
import { Wind, AlertTriangle, CheckCircle } from 'lucide-react';
import { BreathingMetrics } from '../types';
import { Card3D } from './Card3D';

interface BreathingTimelineProps {
  breathing: BreathingMetrics;
  durationSeconds?: number;
}

export const BreathingTimeline: React.FC<BreathingTimelineProps> = ({ breathing, durationSeconds = 10 }) => {
  const isHealthy = breathing.diaphragmRechargePresent && breathing.cadenceSynchronyScore > 60;

  return (
    <Card3D glowColor="emerald" className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
            Physiological Breathing Cadence & Pause Analysis
          </h3>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border font-mono backdrop-blur-md ${
          isHealthy ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'
        }`}>
          Synchrony: {breathing.cadenceSynchronyScore}%
        </span>
      </div>

      {/* Breathing Timeline Bar */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2 shadow-inner">
        <div className="flex items-center justify-between text-xs text-slate-200 font-bold mb-1">
          <span>Inhalation / Exhalation Pulse Track</span>
          <span className="text-[11px] font-mono text-slate-400 font-medium">
            Detected: {breathing.detectedBreathsCount} / Expected: ~{breathing.expectedBreathsCount}
          </span>
        </div>

        {/* Visual Bar Timeline */}
        <div className="relative h-8 w-full bg-slate-900/80 rounded-xl border border-white/10 overflow-hidden flex items-center">
          {/* Base Speech Bar */}
          <div className="w-full h-2 bg-white/10 rounded mx-1"></div>

          {/* Breath Inhalation Spans */}
          {breathing.breathSpans.map((span, idx) => {
            const leftPct = (span.start / durationSeconds) * 100;
            const widthPct = Math.max(3, ((span.end - span.start) / durationSeconds) * 100);
            return (
              <div
                key={idx}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                className="absolute top-1 bottom-1 bg-emerald-500/80 border border-emerald-300 rounded-lg flex items-center justify-center text-[9px] font-mono text-white font-bold shadow-md shadow-emerald-500/20 backdrop-blur-md"
                title={`Breath Inhalation: ${span.start}s - ${span.end}s (${span.energyDb}dB)`}
              >
                BREATH
              </div>
            );
          })}

          {!isHealthy && (
            <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none backdrop-blur-xs">
              <span className="text-[10px] font-extrabold text-red-300 uppercase tracking-widest font-mono bg-red-500/20 px-3 py-0.5 rounded-full border border-red-500/40">
                ⚠️ Continuous Un-Recharged AI Speech
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 font-medium">
          <span>0.0s</span>
          <span>{(durationSeconds * 0.5).toFixed(1)}s</span>
          <span>{durationSeconds.toFixed(1)}s</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Diaphragm Inhalations</p>
          <div className="flex items-center space-x-2 mt-0.5">
            {breathing.diaphragmRechargePresent ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span className={`font-bold font-mono ${breathing.diaphragmRechargePresent ? 'text-emerald-400' : 'text-red-400'}`}>
              {breathing.diaphragmRechargePresent ? 'CONFIRMED' : 'MISSING / ZERO'}
            </span>
          </div>
        </div>

        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Unnatural Pause Ratio</p>
          <p className={`text-sm font-black font-mono mt-0.5 ${
            breathing.unnaturalPauseRatio > 40 ? 'text-red-400' : 'text-slate-100'
          }`}>
            {breathing.unnaturalPauseRatio}%
          </p>
        </div>

        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Cadence Metric</p>
          <p className="text-sm font-black text-slate-100 font-mono mt-0.5">
            {breathing.cadenceSynchronyScore}% Synchrony
          </p>
        </div>
      </div>
    </Card3D>
  );
};
