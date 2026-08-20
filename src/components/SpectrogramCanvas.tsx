import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, Scissors, Activity, Radio, Sparkles } from 'lucide-react';
import { SpectralMetrics } from '../types';
import { Card3D } from './Card3D';

interface SpectrogramCanvasProps {
  spectral: SpectralMetrics;
  spectrogramMatrix?: number[][];
  durationSeconds?: number;
  onSliceScan?: (range: { start: number; end: number }) => void;
}

export const SpectrogramCanvas: React.FC<SpectrogramCanvasProps> = ({
  spectral,
  spectrogramMatrix,
  durationSeconds = 8.0,
  onSliceScan
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Layer Toggles
  const [showPitchContour, setShowPitchContour] = useState<boolean>(true);
  const [showHarmonics, setShowHarmonics] = useState<boolean>(true);
  const [showVocoderMarkers, setShowVocoderMarkers] = useState<boolean>(true);

  // Slice Selection Range (in seconds)
  const [sliceStart, setSliceStart] = useState<number>(0);
  const [sliceEnd, setSliceEnd] = useState<number>(durationSeconds);
  const [isTrimmingActive, setIsTrimmingActive] = useState<boolean>(false);

  useEffect(() => {
    setSliceEnd(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Matrix
    const matrix = spectrogramMatrix || Array.from({ length: 28 }, (_, rowIdx) =>
      Array.from({ length: 64 }, (_, colIdx) => Math.min(1, Math.sin(colIdx * 0.2 + rowIdx * 0.4) * 0.4 + Math.random() * 0.5))
    );

    const rows = matrix.length;
    const cols = matrix[0]?.length || 64;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // 1. Heatmap Base Rendering
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const energy = matrix[r][c];
        const y = height - (r + 1) * cellHeight;
        const x = c * cellWidth;

        let color = '#020617';
        if (energy > 0.8) color = '#ef4444';      // Red
        else if (energy > 0.6) color = '#f59e0b'; // Amber
        else if (energy > 0.4) color = '#10b981'; // Emerald
        else if (energy > 0.2) color = '#06b6d4'; // Cyan
        else if (energy > 0.05) color = '#1e3a8a';// Blue

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
      }
    }

    // 2. Harmonic Overlays Layer
    if (showHarmonics) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      for (let h = 1; h <= 4; h++) {
        const hY = height - (height * (h * 0.18));
        ctx.beginPath();
        ctx.moveTo(0, hY);
        ctx.lineTo(width, hY);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // 3. Pitch Contour Curve Overlay
    if (showPitchContour) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const x = c * cellWidth + cellWidth / 2;
        const pitchY = height - (height * (spectral.spectralCentroidHz / 8000) * (0.8 + Math.sin(c * 0.25) * 0.15));
        if (c === 0) ctx.moveTo(x, pitchY);
        else ctx.lineTo(x, pitchY);
      }
      ctx.stroke();
    }

    // 4. Vocoder High-Frequency Drop Markers Layer
    if (showVocoderMarkers) {
      const rolloffY = height - (height * (spectral.highFreqRolloffHz / 10000));
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, rolloffY);
      ctx.lineTo(width, rolloffY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Vocoder Artifact Drop Pins
      if (spectral.phaseDiscontinuityIndex > 50) {
        ctx.fillStyle = '#f43f5e';
        const pinX1 = width * 0.35;
        const pinX2 = width * 0.72;
        ctx.beginPath();
        ctx.arc(pinX1, rolloffY, 4, 0, Math.PI * 2);
        ctx.arc(pinX2, rolloffY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Selected Slice Region Overlay
    if (isTrimmingActive) {
      const startX = (sliceStart / durationSeconds) * width;
      const endX = (sliceEnd / durationSeconds) * width;

      // Darken outside regions
      ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
      ctx.fillRect(0, 0, startX, height);
      ctx.fillRect(endX, 0, width - endX, height);

      // Highlight active slice region border
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, 0, endX - startX, height);
    }

  }, [spectral, spectrogramMatrix, showPitchContour, showHarmonics, showVocoderMarkers, sliceStart, sliceEnd, durationSeconds, isTrimmingActive]);

  const handleApplySliceScan = () => {
    if (onSliceScan) {
      onSliceScan({ start: Number(sliceStart.toFixed(1)), end: Number(sliceEnd.toFixed(1)) });
    }
  };

  return (
    <Card3D glowColor="purple" className="p-6 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Mel-Frequency Spectrogram & Slice Analyzer
          </h3>
        </div>

        {/* Spectrogram Layer Toggle Buttons */}
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <button
            onClick={() => setShowPitchContour(!showPitchContour)}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              showPitchContour ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            Pitch Contour
          </button>
          <button
            onClick={() => setShowHarmonics(!showHarmonics)}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              showHarmonics ? 'bg-blue-500/20 text-blue-300 border-blue-400/40' : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            Harmonics
          </button>
          <button
            onClick={() => setShowVocoderMarkers(!showVocoderMarkers)}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              showVocoderMarkers ? 'bg-rose-500/20 text-rose-300 border-rose-400/40' : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            Vocoder Pins
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative glass-card rounded-2xl p-2.5 border border-white/10">
        <canvas
          ref={canvasRef}
          width={700}
          height={170}
          className="w-full h-44 rounded-xl"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-1 font-medium">
          <span>0.0s (Time)</span>
          {showPitchContour && <span className="text-cyan-300">Cyan Line: Pitch Contour</span>}
          {showHarmonics && <span className="text-blue-300">Blue Dash: Harmonics</span>}
          {showVocoderMarkers && <span className="text-rose-400">Rose Pins: Vocoder Artifacts</span>}
          <span>{durationSeconds}s</span>
        </div>
      </div>

      {/* Interactive Slice & Trimmer Section */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-100">Audio Segment Slice Inspector</span>
          </div>

          <button
            onClick={() => setIsTrimmingActive(!isTrimmingActive)}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isTrimmingActive ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-300 border-white/15 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isTrimmingActive ? 'Trimmer Active' : 'Enable Trimmer'}</span>
          </button>
        </div>

        {isTrimmingActive && (
          <div className="space-y-3 pt-1 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 flex justify-between">
                  <span>Slice Start:</span>
                  <span className="font-mono text-cyan-300">{sliceStart.toFixed(1)}s</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, sliceEnd - 0.5)}
                  step={0.1}
                  value={sliceStart}
                  onChange={(e) => setSliceStart(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 flex justify-between">
                  <span>Slice End:</span>
                  <span className="font-mono text-cyan-300">{sliceEnd.toFixed(1)}s</span>
                </label>
                <input
                  type="range"
                  min={sliceStart + 0.5}
                  max={durationSeconds}
                  step={0.1}
                  value={sliceEnd}
                  onChange={(e) => setSliceEnd(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">
                Inspecting: <strong className="text-cyan-300">{(sliceEnd - sliceStart).toFixed(1)}s</strong> segment
              </span>
              <button
                onClick={handleApplySliceScan}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan Sliced Segment</span>
              </button>
            </div>
          </div>
        )}
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
