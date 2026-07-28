import React from 'react';
import { Card3D } from './Card3D';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ConfidenceGaugeProps {
  score: number;
  verdict: string;
  syntheticProbability: number;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  verdict,
  syntheticProbability,
}) => {
  const isDeepfake = verdict === 'DEEPFAKE_DETECTED';
  const displayPercent = Math.round(score);

  return (
    <Card3D glowColor={isDeepfake ? 'rose' : 'emerald'} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase font-mono flex items-center gap-2">
          {isDeepfake ? (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          Forensic Confidence Index
        </h3>
        <span
          className={`px-3 py-1 text-xs font-bold font-mono rounded-full border ${
            isDeepfake
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {/* Semi-circular gauge visual */}
        <div className="relative w-48 h-24 flex items-end justify-center overflow-hidden">
          <div className="absolute top-0 w-48 h-48 rounded-full border-[12px] border-slate-800" />
          <div
            className={`absolute top-0 w-48 h-48 rounded-full border-[12px] transition-all duration-1000 ${
              isDeepfake ? 'border-rose-500' : 'border-emerald-500'
            }`}
            style={{
              clipPath: `polygon(0 50%, 100% 50%, 100% 0, 0 0)`,
              transform: `rotate(${(displayPercent / 100) * 180 - 180}deg)`,
            }}
          />
          <div className="text-center z-10 mb-1">
            <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {displayPercent}%
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Model Certainty
            </p>
          </div>
        </div>

        <div className="w-full mt-6 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-300 border-b border-white/5 pb-1">
            <span>Synthetic Probability:</span>
            <span className={isDeepfake ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {(syntheticProbability * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Acoustic Rigor Score:</span>
            <span className="text-cyan-300 font-bold">{score.toFixed(1)} / 100</span>
          </div>
        </div>
      </div>
    </Card3D>
  );
};
