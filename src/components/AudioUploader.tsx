import React, { useState, useRef } from 'react';
import { Upload, Mic, MicOff, Database, Play, Loader2, FileAudio } from 'lucide-react';
import { BenchmarkSample } from '../types';
import { Card3D } from './Card3D';

interface AudioUploaderProps {
  onAnalyzeFile: (file: File) => void;
  onAnalyzeSample: (sampleId: string) => void;
  onAnalyzeMic: (audioBase64: string, fileName?: string, isFake?: boolean) => void;
  benchmarkSamples: BenchmarkSample[];
  isLoading: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAnalyzeFile,
  onAnalyzeSample,
  onAnalyzeMic,
  benchmarkSamples,
  isLoading
}) => {
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
        onAnalyzeFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyzeFile(e.target.files[0]);
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
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <FileAudio className="w-4 h-4 text-cyan-400" />
          <span>Select or Record Audio Track</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/10">22.05kHz / 16-bit PCM</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Drag & Drop File Upload */}
        <div
          id="dropzone-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center transition-all backdrop-blur-md ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/20'
              : 'border-white/15 hover:border-cyan-400/60 glass-panel-interactive text-slate-300'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*,.wav,.mp3,.flac,.ogg,.m4a"
            className="hidden"
          />
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 mb-2.5 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-100">
            Upload Audio Clip
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Drag & drop WAV, MP3, FLAC, OGG (Max 25MB)
          </p>
        </div>

        {/* 2. Benchmark Preset Dataset Dropdown */}
        <div className="glass-3d-card rounded-2xl p-5 border border-white/15 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold text-slate-100 flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Benchmark Datasets</span>
              </label>
              <span className="text-[10px] text-cyan-300 font-mono font-bold glass-pill px-2.5 py-0.5 rounded-full border border-cyan-400/30">HuggingFace</span>
            </div>

            <select
              id="select-benchmark-sample"
              value={selectedSampleId}
              onChange={(e) => setSelectedSampleId(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/20 text-xs text-slate-100 rounded-xl p-2.5 font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 backdrop-blur-lg cursor-pointer"
            >
              {benchmarkSamples.map(sample => (
                <option key={sample.id} value={sample.id} className="bg-slate-900 text-slate-100">
                  [{sample.groundTruth}] {sample.title} ({sample.durationSeconds}s)
                </option>
              ))}
            </select>

            <p className="text-[10px] text-slate-300 mt-2.5 line-clamp-2 leading-relaxed font-medium">
              {benchmarkSamples.find(s => s.id === selectedSampleId)?.description}
            </p>
          </div>

          <button
            id="btn-run-benchmark"
            onClick={() => onAnalyzeSample(selectedSampleId)}
            disabled={isLoading}
            className="mt-4 w-full py-2.5 glass-3d-button text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xl transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Analyze Benchmark Sample</span>
              </>
            )}
          </button>
        </div>

        {/* 3. Live Microphone Recording */}
        <div className="glass-3d-card rounded-2xl p-5 border border-white/15 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold text-slate-100 flex items-center space-x-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Live Mic Inspection</span>
              </label>
              {isRecording && (
                <span className="text-[10px] font-mono text-red-400 animate-pulse font-extrabold glass-pill px-2.5 py-0.5 rounded-full border border-red-500/40">
                  REC: 00:{recordTime < 10 ? '0' + recordTime : recordTime}
                </span>
              )}
            </div>

            <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
              Speak into your microphone to test real-time room impulse response (RIR) and breathing cadence.
            </p>

            <div className="mt-3 flex items-center space-x-2">
              <input
                type="checkbox"
                id="check-simulate-fake"
                checked={micSimulateFake}
                onChange={(e) => setMicSimulateFake(e.target.checked)}
                className="rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="check-simulate-fake" className="text-[11px] text-slate-200 font-semibold cursor-pointer">
                Simulate AI Synthetic Voice Filter
              </label>
            </div>
          </div>

          {!isRecording ? (
            <button
              id="btn-start-mic"
              onClick={startRecording}
              disabled={isLoading}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Record Microphone</span>
            </button>
          ) : (
            <button
              id="btn-stop-mic"
              onClick={stopRecording}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 animate-pulse transition-all shadow-lg shadow-red-500/30 ring-1 ring-white/20 active:scale-95"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop & Analyze Recording</span>
            </button>
          )}
        </div>
      </div>
    </Card3D>
  );
};
