import React from 'react';
import { Card3D } from './Card3D';
import { Cpu } from 'lucide-react';

interface PredictionCardProps {
  modelName: string;
  prediction: string;
  confidence: number;
  latencyMs?: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  modelName,
  prediction,
  confidence,
  latencyMs = 180,
}) => {
  const isSynthetic = prediction.toUpperCase().includes('DEEPFAKE') || prediction.toUpperCase().includes('SYNTHETIC');

  return (
    <Card3D glowColor={isSynthetic ? 'rose' : 'emerald'} className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase">{modelName}</h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{latencyMs}ms inference</span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span
          className={`text-base font-extrabold font-mono ${
            isSynthetic ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {prediction}
        </span>
        <span className="text-lg font-mono font-extrabold text-white">
          {(confidence * 100).toFixed(1)}%
        </span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isSynthetic ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
    </Card3D>
  );
};
