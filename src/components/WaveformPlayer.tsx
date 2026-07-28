import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, AlertTriangle, Layers } from 'lucide-react';
import { ForensicReport } from '../types';
import { getSampleAudioUrl } from '../services/api';
import { Card3D } from './Card3D';

interface WaveformPlayerProps {
  report: ForensicReport;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ report }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(report.durationSeconds || 10);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [activeTab, setActiveTab] = useState<'waveform' | 'anomalies'>('waveform');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get audio stream URL
  const audioSrc = report.sourceType === 'benchmark'
    ? getSampleAudioUrl('dfbench_speech25_01')
    : undefined;

  useEffect(() => {
    setDuration(report.durationSeconds || 10);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [report]);

  // Canvas drawing for interactive waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const points = report.waveformPoints || Array.from({ length: 120 }, () => Math.random() * 0.8 + 0.1);
    const barWidth = width / points.length;

    // Draw background grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Anomaly Overlay Regions in red/amber
    if (report.anomalies) {
      report.anomalies.forEach(anom => {
        const startX = (anom.timestampStart / duration) * width;
        const endX = (anom.timestampEnd / duration) * width;
        const regionWidth = Math.max(12, endX - startX);

        ctx.fillStyle = anom.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.2)';
        ctx.fillRect(startX, 0, regionWidth, height);

        ctx.strokeStyle = anom.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, 0, regionWidth, height);
      });
    }

    // Draw bars
    const centerY = height / 2;
    const progressX = (currentTime / duration) * width;

    points.forEach((val, idx) => {
      const x = idx * barWidth;
      const barHeight = val * (height * 0.8);
      const isPast = x <= progressX;

      ctx.fillStyle = isPast
        ? '#06b6d4' // cyan-500
        : '#334155'; // slate-700

      ctx.fillRect(x + 1, centerY - barHeight / 2, barWidth - 2, barHeight);
    });

    // Draw Playhead line
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();

  }, [currentTime, duration, report]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Fallback simulated playback timer if audio element fails to load
        setIsPlaying(true);
      });
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !audioSrc) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, audioSrc]);

  const handleScrub = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <Card3D glowColor="cyan" className="p-6 space-y-5">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <button
            id="btn-play-pause"
            onClick={togglePlay}
            className="w-11 h-11 rounded-2xl glass-3d-button text-white flex items-center justify-center shadow-xl active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            id="btn-restart"
            onClick={() => {
              setCurrentTime(0);
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            className="p-2.5 rounded-xl glass-panel-interactive text-slate-300 transition-all border border-white/10 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono font-bold text-slate-200 glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            <span>{currentTime.toFixed(2)}s</span>
            <span className="text-slate-500 mx-1.5">/</span>
            <span className="text-slate-400">{duration.toFixed(2)}s</span>
          </div>
        </div>

        {/* Anomaly Tabs & Volume */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                setIsMuted(v === 0);
                if (audioRef.current) audioRef.current.volume = v;
              }}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
            <button
              onClick={() => setActiveTab('waveform')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'waveform' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Waveform & Anomaly Overlay</span>
            </button>
            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'anomalies' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flagged Timestamps ({report.anomalies.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Display */}
      {activeTab === 'waveform' ? (
        <div className="space-y-2">
          <div className="relative glass-card rounded-2xl p-3 border border-white/10">
            <canvas
              ref={canvasRef}
              width={800}
              height={140}
              onClick={handleScrub}
              className="w-full h-36 cursor-pointer rounded-xl"
            />
            {/* Timeline Legend */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-1 font-medium">
              <span>0.00s</span>
              <span>{(duration * 0.25).toFixed(1)}s</span>
              <span>{(duration * 0.50).toFixed(1)}s</span>
              <span>{(duration * 0.75).toFixed(1)}s</span>
              <span>{duration.toFixed(1)}s</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-medium">
            Click anywhere on the waveform canvas to scrub audio playhead. Red/Amber overlays indicate physical acoustic anomalies.
          </p>
        </div>
      ) : (
        /* Timestamped Anomalies List */
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {report.anomalies.map((anom, idx) => (
            <div
              key={anom.id || idx}
              onClick={() => {
                setCurrentTime(anom.timestampStart);
                if (audioRef.current) audioRef.current.currentTime = anom.timestampStart;
              }}
              className="p-3.5 glass-panel-interactive rounded-2xl border border-white/10 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border backdrop-blur-md ${
                  anom.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-300 border-red-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  [{anom.timestampStart.toFixed(1)}s - {anom.timestampEnd.toFixed(1)}s]
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-100">{anom.type.replace('_', ' ')}</p>
                  <p className="text-[11px] text-slate-400">{anom.description}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-cyan-300 glass-pill px-2.5 py-1 rounded-full border border-white/10">
                {anom.confidence}% Conf.
              </span>
            </div>
          ))}
        </div>
      )}
    </Card3D>
  );
};
