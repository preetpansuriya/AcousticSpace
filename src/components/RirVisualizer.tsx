import React, { useRef, useEffect, useState } from 'react';
import { Box, Eye, RefreshCw } from 'lucide-react';
import { RirMetrics } from '../types';
import { Card3D } from './Card3D';

interface RirVisualizerProps {
  rir: RirMetrics;
}

export const RirVisualizer: React.FC<RirVisualizerProps> = ({ rir }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'decay' | 'room3d'>('decay');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (viewMode === 'decay') {
        // --- 2D & Isometric Hybrid Impulse Decay Curve ---
        // Draw background grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x <= width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // 1. Expected Room Reflection Decay Curve (Green Line)
        const expectedRt = rir.expectedRt60Seconds || 0.45;
        ctx.strokeStyle = '#10b981'; // emerald
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(20, 20);
        for (let x = 20; x < width - 20; x += 5) {
          const progress = (x - 20) / (width - 40);
          const decay = Math.exp(-progress * (3.5 / expectedRt));
          const y = height - 20 - (height - 40) * decay;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 2. Measured Impulse Response Decay Curve (Cyan or Red if mismatch)
        const isMismatch = rir.reflectionMismatchScore > 50;
        ctx.strokeStyle = isMismatch ? '#ef4444' : '#06b6d4'; // red vs cyan
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, 20);

        const actualRt = Math.max(0.01, rir.rt60Seconds);
        for (let x = 20; x < width - 20; x += 5) {
          const progress = (x - 20) / (width - 40);
          const peakBump = (x > 80 && x < 120 && !isMismatch) ? Math.sin(x * 0.1 + angle) * 0.12 : 0;
          const decay = Math.max(0, Math.exp(-progress * (3.5 / actualRt)) + peakBump);
          const y = height - 20 - (height - 40) * decay;
          ctx.lineTo(x, Math.min(height - 15, Math.max(20, y)));
        }
        ctx.stroke();

        // Key Decay Threshold Marker (60dB drop line)
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(20, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);

      } else {
        // --- 3D Rotating Wireframe Room Acoustic Impulse Projection ---
        angle += 0.015;
        const cx = width / 2;
        const cy = height / 2;
        const isMismatch = rir.reflectionMismatchScore > 50;

        // 3D Room Box Cube Vertices
        const size = Math.min(width, height) * 0.35;
        const rawVertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
        ];

        // Rotate Vertices around Y axis
        const projected = rawVertices.map(([vx, vy, vz]) => {
          const rx = vx * Math.cos(angle) - vz * Math.sin(angle);
          const rz = vx * Math.sin(angle) + vz * Math.cos(angle) + 2.5;
          const fov = 320;
          return {
            x: cx + (rx * fov) / rz,
            y: cy + (vy * fov) / rz
          };
        });

        // Room Wall Edges
        const edges = [
          [0,1], [1,2], [2,3], [3,0],
          [4,5], [5,6], [6,7], [7,4],
          [0,4], [1,5], [2,6], [3,7]
        ];

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        });

        // Speaker Source Light Core
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Animated Sound Reflection Ray Bounces
        const rayCount = 12;
        ctx.strokeStyle = isMismatch ? '#ef4444' : '#10b981';
        ctx.lineWidth = 1;
        for (let r = 0; r < rayCount; r++) {
          const rayAngle = (r / rayCount) * Math.PI * 2 + angle * 2;
          const rayDist = (Math.sin(angle * 3 + r) * 0.5 + 0.5) * (size * 0.9);
          const rx = cx + Math.cos(rayAngle) * rayDist;
          const ry = cy + Math.sin(rayAngle) * rayDist;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(rx, ry);
          ctx.stroke();

          // Reflection Point Spark
          ctx.fillStyle = isMismatch ? '#f43f5e' : '#34d399';
          ctx.beginPath();
          ctx.arc(rx, ry, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [rir, viewMode]);

  return (
    <Card3D glowColor="cyan" className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Box className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
            Room Impulse Response (RIR) Wall Reflection Physics
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(v => v === 'decay' ? 'room3d' : 'decay')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 transition-all active:scale-95"
          >
            {viewMode === 'decay' ? <Eye className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
            <span>{viewMode === 'decay' ? '3D Room View' : 'Decay Curve'}</span>
          </button>

          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border font-mono backdrop-blur-md ${
            rir.reflectionMismatchScore > 50
              ? 'bg-red-500/10 text-red-300 border-red-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            Mismatch: {rir.reflectionMismatchScore}%
          </span>
        </div>
      </div>

      {/* RIR Reflection Graph Canvas */}
      <div className="relative glass-card rounded-2xl p-3 border border-white/10 shadow-inner">
        <canvas
          ref={canvasRef}
          width={700}
          height={150}
          className="w-full h-36 rounded-xl"
        />

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-1">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-0.5 bg-emerald-500 inline-block"></span>
              <span>Expected Room Decay</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className={`w-2.5 h-1 inline-block ${
                rir.reflectionMismatchScore > 50 ? 'bg-red-500' : 'bg-cyan-500'
              }`}></span>
              <span>Measured Vocal Reflection (RT60 = {rir.rt60Seconds}s)</span>
            </span>
          </div>
          <span>EDT: {rir.earlyDecayTimeEdt}s</span>
        </div>
      </div>

      {/* Acoustic Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Measured RT60 Decay</p>
          <p className={`text-sm font-black font-mono mt-0.5 ${
            rir.rt60Seconds < 0.1 ? 'text-red-400' : 'text-slate-100'
          }`}>
            {rir.rt60Seconds} sec
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Expected: ~{rir.expectedRt60Seconds}s</p>
        </div>

        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Clarity Ratio C50</p>
          <p className="text-sm font-black text-slate-100 font-mono mt-0.5">
            {rir.clarityC50Db} dB
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 font-bold">&gt;15dB indicates dry AI voice</p>
        </div>

        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Room Size Projection</p>
          <p className="text-sm font-black text-slate-100 font-mono mt-0.5">
            ~{rir.estimatedRoomVolumeM3} m³
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Physical room estimate</p>
        </div>

        <div className="glass-3d-card p-3 rounded-2xl border border-white/15 shadow-lg">
          <p className="text-[10px] uppercase text-slate-300 font-extrabold">Reflection Peaks</p>
          <p className="text-sm font-black text-slate-100 font-mono mt-0.5">
            {rir.reflectionPeaksCount} Wall Peaks
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Specular reflections</p>
        </div>
      </div>
    </Card3D>
  );
};

