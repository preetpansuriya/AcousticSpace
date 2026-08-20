import React, { useState, useRef } from 'react';
import { Upload, Mic, MicOff, Database, Play, Loader2, FileAudio, CheckCircle2, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { BenchmarkSample } from '../types';
import { Card3D } from './Card3D';

interface AudioUploaderProps {
  onAnalyzeFile: (file: File) => void;
  onAnalyzeSample: (sampleId: string) => void;
  onAnalyzeMic: (audioBase64: string, fileName?: string, isFake?: boolean) => void;
  onOpenBulkScanner?: () => void;
  benchmarkSamples: BenchmarkSample[];
  isLoading: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAnalyzeFile,
  onAnalyzeSample,
  onAnalyzeMic,
  onOpenBulkScanner,
  benchmarkSamples,
  isLoading
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'mic' | 'benchmark'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('dfbench_speech25_01');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [micSimulateFake, setMicSimulateFake] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || file.name.match(/\.(wav|mp3|flac|ogg|m4a|aac)$/i)) {
        setSelectedFile(file);
        onAnalyzeFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onAnalyzeFile(file);
    }
  };

  // Microphone recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onAnalyzeMic(base64data, `Mic_Recording_${Date.now()}.wav`, micSimulateFake);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or not available in current environment.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  return (
    <Card3D glowColor="cyan" className="p-6 space-y-5">
      {/* Console Header & Mode Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-100 flex items-center space-x-2">
              <span>Acoustic Audio Forensic Console</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Upload audio clip for acoustic deepfake inspection & synthetic voice detection
            </p>
          </div>
        </div>

        {/* Unified Input Sub-tabs & Bulk Scanner Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-white/10">
            <button
              id="tab-input-upload"
              onClick={() => setActiveInputTab('upload')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeInputTab === 'upload'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>

            <button
              id="tab-input-mic"
              onClick={() => setActiveInputTab('mic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeInputTab === 'mic'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Live Mic</span>
            </button>

            <button
              id="tab-input-benchmark"
              onClick={() => setActiveInputTab('benchmark')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeInputTab === 'benchmark'
                  ? 'bg-blue-500/25 text-blue-300 border border-blue-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Benchmark Dataset</span>
            </button>
          </div>

          {onOpenBulkScanner && (
            <button
              id="btn-open-bulk-scanner"
              onClick={onOpenBulkScanner}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 border border-cyan-400/50 cursor-pointer active:scale-95 transition-all"
              title="Launch Bulk Multi-Audio Scanner"
            >
              <Layers className="w-4 h-4 text-cyan-200" />
              <span>Bulk Scanner</span>
            </button>
          )}
        </div>
      </div>

      {/* SINGLE PANEL VIEW: Upload Audio File Focus */}
      {activeInputTab === 'upload' && (
        <div className="space-y-4">
          <div
            id="dropzone-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all backdrop-blur-md relative overflow-hidden ${
              dragActive
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-xl shadow-cyan-500/20 scale-[1.01]'
                : 'border-cyan-400/30 hover:border-cyan-400/80 glass-panel-interactive text-slate-300'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*,.wav,.mp3,.flac,.ogg,.m4a"
              className="hidden"
            />

            <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 mb-3 shadow-lg shadow-cyan-500/10">
              <Upload className="w-8 h-8 animate-bounce" />
            </div>

            <p className="text-sm font-extrabold text-slate-100">
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Drop or Click to Upload Audio File / Call Recording'}
            </p>
            <p className="text-xs text-slate-300 mt-1 max-w-md font-medium">
              Upload call recordings, voice notes, or audio files (WAV, MP3, M4A, FLAC, OGG). The AI engine instantly determines if the voice is <span className="text-emerald-400 font-bold">REAL (Authentic Human)</span> or <span className="text-rose-400 font-bold">FAKE (AI Deepfake / Cloned)</span>.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">Call Recordings & Voice Notes</span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">Real Human vs AI Clone</span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">Gemini 3.6 Forensic AI</span>
            </div>

            {selectedFile && (
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>File loaded successfully ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB). Analyzing...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
            <span className="flex items-center space-x-1 text-cyan-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Genuine Acoustic Forensic Engine</span>
            </span>
            <span>Max file size: 25MB</span>
          </div>
        </div>
      )}

      {/* SINGLE PANEL VIEW: Benchmark Dataset */}
      {activeInputTab === 'benchmark' && (
        <div className="glass-3d-card rounded-2xl p-6 border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Select Benchmark Forensic Sample</span>
            </label>
            <span className="text-[10px] text-cyan-300 font-mono font-bold glass-pill px-2.5 py-0.5 rounded-full border border-cyan-400/30">HuggingFace Dataset</span>
          </div>

          <select
            id="select-benchmark-sample"
            value={selectedSampleId}
            onChange={(e) => setSelectedSampleId(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/20 text-xs text-slate-100 rounded-xl p-3 font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 backdrop-blur-lg cursor-pointer"
          >
            {benchmarkSamples.map(sample => (
              <option key={sample.id} value={sample.id} className="bg-slate-900 text-slate-100">
                [{sample.groundTruth}] {sample.title} ({sample.durationSeconds}s)
              </option>
            ))}
          </select>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {benchmarkSamples.find(s => s.id === selectedSampleId)?.description}
          </p>

          <button
            id="btn-run-benchmark"
            onClick={() => onAnalyzeSample(selectedSampleId)}
            disabled={isLoading}
            className="w-full py-3 glass-3d-button text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xl transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze Selected Benchmark Sample</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* SINGLE PANEL VIEW: Live Microphone */}
      {activeInputTab === 'mic' && (
        <div className="glass-3d-card rounded-2xl p-6 border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-100 flex items-center space-x-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Live Microphone Inspection</span>
            </label>
            {isRecording && (
              <span className="text-[10px] font-mono text-red-400 animate-pulse font-extrabold glass-pill px-2.5 py-0.5 rounded-full border border-red-500/40">
                REC: 00:{recordTime < 10 ? '0' + recordTime : recordTime}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Speak into your microphone to capture real-time acoustic room impulse response (RIR) and physiological breathing cadence.
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="check-simulate-fake"
              checked={micSimulateFake}
              onChange={(e) => setMicSimulateFake(e.target.checked)}
              className="rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="check-simulate-fake" className="text-xs text-slate-200 font-semibold cursor-pointer">
              Apply AI Synthetic Voice Filter Simulation
            </label>
          </div>

          {!isRecording ? (
            <button
              id="btn-start-mic"
              onClick={startRecording}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording Microphone</span>
            </button>
          ) : (
            <button
              id="btn-stop-mic"
              onClick={stopRecording}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 animate-pulse transition-all shadow-lg shadow-red-500/30 ring-1 ring-white/20 active:scale-95"
            >
              <MicOff className="w-4 h-4" />
              <span>Stop & Run Forensic Analysis</span>
            </button>
          )}
        </div>
      )}
    </Card3D>
  );
};
