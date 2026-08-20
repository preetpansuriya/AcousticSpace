import React from 'react';
import { ShieldCheck, ShieldAlert, Fingerprint, Sparkles, AlertCircle } from 'lucide-react';
import { WatermarkInfo } from '../types';
import { Card3D } from './Card3D';

interface WatermarkCardProps {
  watermarkInfo?: WatermarkInfo;
}

export const WatermarkCard: React.FC<WatermarkCardProps> = ({ watermarkInfo }) => {
  if (!watermarkInfo) return null;

  return (
    <Card3D glowColor={watermarkInfo.detected ? 'rose' : 'emerald'} className="p-5">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
        <div className="flex items-center space-x-2">
          <Fingerprint className={`w-4 h-4 ${watermarkInfo.detected ? 'text-rose-400' : 'text-emerald-400'}`} />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Audio Digital Watermark & Signature Inspector
          </h3>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${
          watermarkInfo.detected
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {watermarkInfo.detected ? 'WATERMARK DETECTED' : 'NO WATERMARK'}
        </span>
      </div>

      <div className="flex items-start space-x-3">
        <div className={`p-2.5 rounded-2xl border ${
          watermarkInfo.detected ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {watermarkInfo.detected ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-100">
              {watermarkInfo.signatureType || 'C2PA / Frequency Domain Check'}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Confidence: {watermarkInfo.confidence}%
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            {watermarkInfo.details}
          </p>
        </div>
      </div>
    </Card3D>
  );
};
