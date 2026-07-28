import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ZoomIn, ZoomOut } from 'lucide-react';
import { ForensicReport } from '../types';

interface WaveformViewerProps {
  report: ForensicReport;
  onSelectTimestamp?: (timestamp: number) => void;
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({ report, onSelectTimestamp }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);

  const duration = report.durationSeconds || 10;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Render Canvas Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const points = report.waveformPoints || Array.from({ length: 150 }, () => Math.random() * 0.75 + 0.1);
    const visiblePointsCount = Math.max(30, Math.floor(points.length / zoomLevel));
    const visiblePoints = points.slice(0, visiblePointsCount);
    const barWidth = width / visiblePoints.length;

    // Draw Background Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 0; y <= height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Anomaly Highlights
    if (report.anomalies) {
      report.anomalies.forEach((anom) => {
        const startX = (anom.timestampStart / duration) * width;
        const endX = (anom.timestampEnd / duration) * width;
        const regionWidth = Math.max(14, endX - startX);

        ctx.fillStyle = anom.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.22)' : 'rgba(245, 158, 11, 0.18)';
        ctx.fillRect(startX, 0, regionWidth, height);

        ctx.strokeStyle = anom.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, 0, regionWidth, height);
      });
    }

    // Draw Bars
    const centerY = height / 2;
    const progressX = (currentTime / duration) * width;

    visiblePoints.forEach((val, idx) => {
      const x = idx * barWidth;
      const barHeight = val * (height * 0.82);
      const isPast = x <= progressX;

      ctx.fillStyle = isPast ? '#06b6d4' : '#334155';
      ctx.fillRect(x + 1, centerY - barHeight / 2, barWidth - 2, barHeight);
    });

    // Playhead Marker
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();

  }, [currentTime, duration, zoomLevel, report]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
    if (onSelectTimestamp) {
      onSelectTimestamp(newTime);
    }
  };

  return (
    <div className="p-5 glass-card rounded-2xl border border-white/10 space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center justify-center hover:bg-cyan-400 transition-all shadow-md active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentTime(0)}
            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono font-bold text-slate-200 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-cyan-400">{currentTime.toFixed(2)}s</span>
            <span className="text-slate-500 mx-1.5">/</span>
            <span className="text-slate-400">{duration.toFixed(2)}s</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Zoom Buttons */}
          <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono text-[11px] text-slate-300">{zoomLevel}x</span>

            <button
              onClick={() => setZoomLevel((z) => Math.min(4, z + 0.5))}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                setIsMuted(val === 0);
              }}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={130}
          onClick={handleCanvasClick}
          className="w-full h-32 cursor-pointer rounded-xl bg-slate-950/60 border border-white/5"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 px-1">
          <span>0.00s</span>
          <span>{(duration * 0.25).toFixed(1)}s</span>
          <span>{(duration * 0.5).toFixed(1)}s</span>
          <span>{(duration * 0.75).toFixed(1)}s</span>
          <span>{duration.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
};
