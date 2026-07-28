import React, { useRef, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { SpectralMetrics } from '../types';
import { Card3D } from './Card3D';

interface SpectrogramCanvasProps {
  spectral: SpectralMetrics;
  spectrogramMatrix?: number[][];
}

export const SpectrogramCanvas: React.FC<SpectrogramCanvasProps> = ({ spectral, spectrogramMatrix }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Fallback matrix if not provided
    const matrix = spectrogramMatrix || Array.from({ length: 24 }, (_, rowIdx) =>
      Array.from({ length: 60 }, (_, colIdx) => Math.min(1, Math.sin(colIdx * 0.2 + rowIdx * 0.4) * 0.4 + Math.random() * 0.5))
    );

    const rows = matrix.length;
    const cols = matrix[0]?.length || 60;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Heatmap rendering (Inverted Y so 0 Hz is at bottom)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const energy = matrix[r][c];
        const y = height - (r + 1) * cellHeight;
        const x = c * cellWidth;

        // Custom Color Gradient Map (Deep Blue -> Cyan -> Emerald -> Yellow -> Red/White)
        let color = '#020617';
        if (energy > 0.8) color = '#ef4444';      // Red
        else if (energy > 0.6) color = '#f59e0b'; // Yellow/Amber
        else if (energy > 0.4) color = '#10b981'; // Emerald
        else if (energy > 0.2) color = '#06b6d4'; // Cyan
        else if (energy > 0.05) color = '#1e3a8a';// Blue

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
      }
    }

    // Draw Spectral Centroid Curve Overlay in Bright White/Yellow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let c = 0; c < cols; c++) {
      const x = c * cellWidth + cellWidth / 2;
      const centroidY = height - (height * (spectral.spectralCentroidHz / 8000) * (0.8 + Math.sin(c * 0.3) * 0.1));
      if (c === 0) ctx.moveTo(x, centroidY);
      else ctx.lineTo(x, centroidY);
    }
    ctx.stroke();

    // High Frequency Rolloff Line (>6.8kHz threshold)
    const rolloffY = height - (height * (spectral.highFreqRolloffHz / 10000));
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, rolloffY);
    ctx.lineTo(width, rolloffY);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [spectral, spectrogramMatrix]);

  return (
    <Card3D glowColor="purple" className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Mel-Frequency Spectrogram & Phase Analysis
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-300 glass-pill px-2.5 py-0.5 rounded-full border border-white/10">
          0 Hz – 11.025 kHz
        </span>
      </div>

      <div className="relative glass-card rounded-2xl p-2.5 border border-white/10">
        <canvas
          ref={canvasRef}
          width={700}
          height={160}
          className="w-full h-40 rounded-xl"
        />

        {/* Axis Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-1 font-medium">
          <span>0.0s (Time)</span>
          <span className="text-amber-300">White Line: Spectral Centroid</span>
          <span className="text-red-400">Red Dash: High-Freq Rolloff</span>
        </div>
      </div>

      {/* Spectral Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="glass-panel p-3 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase text-slate-400 font-bold">Spectral Centroid</p>
          <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
            {spectral.spectralCentroidHz} Hz
          </p>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase text-slate-400 font-bold">High-Freq Rolloff</p>
          <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
            {spectral.highFreqRolloffHz} Hz
          </p>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase text-slate-400 font-bold">Vocoder Phase Drop</p>
          <p className={`text-sm font-bold font-mono mt-0.5 ${
            spectral.phaseDiscontinuityIndex > 50 ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {spectral.phaseDiscontinuityIndex}%
          </p>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase text-slate-400 font-bold">MFCC Variance</p>
          <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
            {spectral.mfccVariance}
          </p>
        </div>
      </div>
    </Card3D>
  );
};
