import React from 'react';
import { Users, User, ShieldAlert, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { SpeakerSegment } from '../types';
import { Card3D } from './Card3D';

interface SpeakerDiarizationPanelProps {
  segments?: SpeakerSegment[];
  durationSeconds?: number;
}

export const SpeakerDiarizationPanel: React.FC<SpeakerDiarizationPanelProps> = ({
  segments,
  durationSeconds = 8.0
}) => {
  if (!segments || segments.length === 0) return null;

  return (
    <Card3D glowColor="cyan" className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Multi-Speaker Diarization & Authenticity Breakdown
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-300 glass-pill px-2.5 py-0.5 rounded-full border border-white/10">
          {segments.length} Speakers Identified
        </span>
      </div>

      {/* Timeline Visual Bar */}
      <div className="glass-card p-3 rounded-2xl border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>0.0s</span>
          <span>Speaker Timeline Track</span>
          <span>{durationSeconds}s</span>
        </div>

        <div className="relative h-7 bg-slate-950 rounded-xl overflow-hidden flex p-1 gap-1 border border-white/10">
          {segments.map((spk, idx) => {
            const widthPct = Math.max(15, ((spk.endTime - spk.startTime) / durationSeconds) * 100);
            return (
              <div
                key={spk.speakerId || idx}
                style={{ width: `${widthPct}%` }}
                className={`h-full rounded-lg flex items-center justify-center px-2 text-[10px] font-extrabold font-mono transition-all ${
                  spk.isAiGenerated
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                }`}
                title={`${spk.label}: ${spk.startTime}s - ${spk.endTime}s (${spk.isAiGenerated ? 'AI Synthetic' : 'Real Human'})`}
              >
                <span className="truncate">{spk.label.split(' ')[0]} ({spk.isAiGenerated ? 'AI' : 'REAL'})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speaker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {segments.map((spk) => (
          <div
            key={spk.speakerId}
            className={`glass-panel p-4 rounded-2xl border transition-all ${
              spk.isAiGenerated ? 'border-rose-500/30 bg-rose-500/5' : 'border-emerald-500/30 bg-emerald-500/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${spk.isAiGenerated ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-100">{spk.label}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{spk.startTime}s – {spk.endTime}s</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold flex items-center space-x-1 border ${
                spk.isAiGenerated
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {spk.isAiGenerated ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                <span>{spk.isAiGenerated ? 'AI CLONE' : 'HUMAN'}</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-medium mt-1">
              {spk.vocalCharacteristics}
            </p>

            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/10 pt-2">
              <span>Classifier Confidence:</span>
              <strong className="text-slate-200">{spk.confidence}%</strong>
            </div>
          </div>
        ))}
      </div>
    </Card3D>
  );
};
