import React, { useState, useEffect, useRef } from 'react';
import { Card3D } from '../components/Card3D';
import { Mic, MicOff, Volume2, ShieldAlert, Radio, Activity, CheckCircle2, Loader2 } from 'lucide-react';
import { ForensicReport } from '../types';

interface LiveMicPageProps {
  onAnalyzeMic: (audioBase64: string, fileName?: string, isFake?: boolean) => void;
  isLoading: boolean;
  currentReport: ForensicReport | null;
}

export const LiveMicPage: React.FC<LiveMicPageProps> = ({
  onAnalyzeMic,
  isLoading,
  currentReport
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [simulateFake, setSimulateFake] = useState<boolean>(false);
  const [dbLevel, setDbLevel] = useState<number>(-60);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Web Audio API live visualiser on active stream
  const startLiveVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const width = canvas.width;
        const height = canvas.height;

        analyser.getByteFrequencyData(dataArray);

        // Compute average dB volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const computedDb = Math.round((avg / 255) * 80 - 60);
        setDbLevel(computedDb);

        // Draw 3D-styled Frequency Bars
        canvasCtx.clearRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.85;

          // Gradient bar
          const grad = canvasCtx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.5, '#3b82f6');
          grad.addColorStop(1, '#a855f7');

          canvasCtx.fillStyle = grad;
          canvasCtx.fillRect(x, height - barHeight, barWidth - 3, barHeight);

          // Top highlight line
          canvasCtx.fillStyle = '#67e8f9';
          canvasCtx.fillRect(x, height - barHeight - 2, barWidth - 3, 2);

          x += barWidth + 1;
        }

        animFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (e) {
      console.warn('Audio Context live view failed:', e);
    }
  };

  const stopLiveVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startMicRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicActive(true);
      startLiveVisualizer(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        stopLiveVisualizer();
        setMicActive(false);

        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onAnalyzeMic(base64data, `Live_Mic_Inspection_${Date.now()}.wav`, simulateFake);
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      stopLiveVisualizer();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card3D glowColor="cyan" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
                <span>Real-Time Microphone Forensic Studio</span>
              </h2>
              <p className="text-xs text-slate-400">
                Capture live speech to analyze environmental reverb, RT60 decay, and breathing cadence in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300 border border-white/10 flex items-center space-x-2">
              <Radio className={`w-3.5 h-3.5 ${micActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{micActive ? 'MIC STREAM LIVE' : 'MIC READY'}</span>
            </div>
          </div>
        </div>

        {/* Studio Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Live Recording Panel */}
          <div className="md:col-span-2 glass-3d-card p-6 rounded-2xl border border-white/15 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Live Audio Signal Visualizer</span>
              </span>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-bold text-cyan-300">{dbLevel} dB</span>
              </div>
            </div>

            {/* Live Canvas Visualizer */}
            <div className="relative h-32 rounded-xl bg-slate-950/80 border border-white/15 p-2 overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={120}
                className="w-full h-full object-cover rounded-lg"
              />
              {!micActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs">
                  <Mic className="w-8 h-8 text-cyan-400/50 mb-2" />
                  <p className="text-xs text-slate-400 font-medium">Click "Start Live Inspection" to activate microphone</p>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="chk-sim-fake"
                  checked={simulateFake}
                  onChange={(e) => setSimulateFake(e.target.checked)}
                  className="rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="chk-sim-fake" className="text-xs text-slate-200 font-medium cursor-pointer">
                  Inject AI Neural TTS Reverb Artifacts
                </label>
              </div>

              {!isRecording ? (
                <button
                  onClick={startMicRecording}
                  disabled={isLoading}
                  className="py-3 px-6 glass-3d-button bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Live Mic Inspection</span>
                </button>
              ) : (
                <button
                  onClick={stopMicRecording}
                  className="py-3 px-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xl active:scale-95 transition-all"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop & Run RIR Forensic Audit (00:{recordSeconds < 10 ? '0' + recordSeconds : recordSeconds})</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick RIR Diagnostics Panel */}
          <div className="glass-3d-card p-6 rounded-2xl border border-white/15 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-100 flex items-center space-x-2 border-b border-white/10 pb-3 mb-3">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Forensic Parameter Check</span>
              </h3>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                  <span>Room Decay (RT60):</span>
                  <span className="font-mono text-cyan-300 font-bold">0.38s - 0.65s</span>
                </li>
                <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                  <span>Breathing Recharge:</span>
                  <span className="font-mono text-emerald-400 font-bold">Monitored</span>
                </li>
                <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                  <span>Neural Vocoder Artifacts:</span>
                  <span className="font-mono text-indigo-300 font-bold">Spectral AST</span>
                </li>
              </ul>
            </div>

            {isLoading && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-cyan-300 text-xs flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing RIR Acoustic Features...</span>
              </div>
            )}
          </div>
        </div>
      </Card3D>

      {/* Latest Live Analysis Result */}
      {currentReport && (
        <Card3D glowColor={currentReport.verdict === 'DEEPFAKE_DETECTED' ? 'rose' : 'emerald'} className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Inspection Result: {currentReport.fileName}</span>
            </h3>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
              currentReport.verdict === 'DEEPFAKE_DETECTED'
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {currentReport.verdict} ({currentReport.overallDeepfakeProbability}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400">Reflection Mismatch:</span>
              <p className="text-lg font-mono font-extrabold text-cyan-300 mt-1">
                {currentReport.rir.reflectionMismatchScore} / 100
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400">Measured RT60 Decay:</span>
              <p className="text-lg font-mono font-extrabold text-indigo-300 mt-1">
                {currentReport.rir.rt60Seconds}s
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400">Missing Breathing Ratio:</span>
              <p className="text-lg font-mono font-extrabold text-amber-300 mt-1">
                {currentReport.breathing.missingBreathRatio * 100}%
              </p>
            </div>
          </div>
        </Card3D>
      )}
    </div>
  );
};
