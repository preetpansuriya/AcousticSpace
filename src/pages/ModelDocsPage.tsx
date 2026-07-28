import React, { useState } from 'react';
import { BookOpen, Cpu, Box, Wind, ShieldAlert, Sparkles, Layers, Activity, Calendar, Code, Server } from 'lucide-react';

export const ModelDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fastapi' | 'roadmap'>('overview');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Infotact Solutions - Project 1
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  FastAPI + PyTorch AST
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-1">
                AcousticSpace: Deepfake Detection via Room Impulse Response (RIR)
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                Physics-based audio forensic analysis isolating background room reflections and speaker breathing patterns.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Architecture & Physics
            </button>
            <button
              onClick={() => setActiveTab('fastapi')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'fastapi'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>FastAPI Gateway</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>4-Week Plan</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 1. Problem Statement & Paradigm Shift */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-3">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2 text-cyan-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Problem Statement & Physics-Based Paradigm</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Current deepfake audio detectors focus primarily on vocal pitch artifacts or robotic tone inflections. Modern generative AI (ElevenLabs, XTTS, Bark) easily bypasses these standard biometric checks, making vocal audio fraud detection obsolete.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              <strong className="text-white">AcousticSpace Solution:</strong> When a security analyst at Infotact uploads a suspected deepfake audio clip, AcousticSpace does not just listen to the voice; it mathematically isolates the background <strong className="text-cyan-300">"Room Impulse Response" (RIR)</strong> (how sound bounces off physical walls) and the speaker's physiological breathing patterns. The analyst dashboard instantly flags artificially generated audio because synthetic TTS voice reflections fail to match physical room acoustic reflection bounds.
            </p>
          </div>

          {/* 2. Key Modules & Physics Math */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Module A: RIR & Reverb Isolation */}
            <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Box className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Module A: Room Impulse Response (Librosa & Python)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Measures acoustic wall reverberation decay time (RT60) and Early Decay Time (EDT). Real human speech in a physical room exhibits specular reflections off surfaces.
              </p>
              <div className="glass-card p-3.5 rounded-2xl border border-white/10 font-mono text-[11px] text-cyan-300 font-semibold shadow-inner">
                RT60 = 0.161 × (V / A) [Sabine Formula]
                <br />
                Wall Mismatch = |RT60_measured - RT60_expected| / RT60_expected
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside font-medium">
                <li>Detects dry neural vocoder tracks operating in zero-reverb booths.</li>
                <li>Identifies mid-sentence acoustic shifts from spliced audio clips.</li>
              </ul>
            </div>

            {/* Module B: Physiological Breathing Cadence */}
            <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Wind className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Module B: Physiological Breathing Cadence</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Tracks subtle diaphragm air inhalations in speech pauses (-45dB to -25dB band). Humans require lung recharge every 3 to 4 seconds during active speech.
              </p>
              <div className="glass-card p-3.5 rounded-2xl border border-white/10 font-mono text-[11px] text-emerald-300 font-semibold shadow-inner">
                Breath Cadence = Detected Inhalations / Expected Speech Length
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside font-medium">
                <li>AI voice streams continuously without diaphragm recharge intervals.</li>
                <li>Flags unnatural robotic silent pauses inserted by text chunking.</li>
              </ul>
            </div>
          </div>

          {/* 3. Audio Spectrogram Transformer (AST) Architecture */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-4">
            <div className="flex items-center space-x-2 text-purple-400">
              <Cpu className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Transformer Classifier (PyTorch AST & HuggingFace)</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              The fine-tuned Audio Spectrogram Transformer (AST) converts 2D Mel-Spectrogram patches into self-attention embeddings, evaluating high-frequency vocoder phase cancellation (&gt;6.8 kHz) and mel-energy kurtosis.
            </p>

            <div className="glass-card p-4 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <p className="text-cyan-300 font-bold mb-1">1. Librosa DSP Pipeline</p>
                <p className="text-[11px] text-slate-400 font-sans font-medium">Mel-Spectrogram extraction, RIR reverberation decay & spectral centroid calculation.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <p className="text-purple-300 font-bold mb-1">2. AST Transformer</p>
                <p className="text-[11px] text-slate-400 font-sans font-medium">Attention mechanism tracking room acoustic vs vocal formant alignment.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <p className="text-emerald-300 font-bold mb-1">3. FastAPI Gateway</p>
                <p className="text-[11px] text-slate-400 font-sans font-medium">Serves the ML model for low-latency real-time inference with Pydantic validation.</p>
              </div>
            </div>
          </div>

          {/* 4. Key UI & Visual Design Architecture Highlights */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Key UI & Visual Design Architecture Highlights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <Box className="w-4 h-4" />
                  <span>Cursor Tracking & Interactive Orbiting</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  WebGL 3D Spectrum Equalizer Grid & 3D Sphere Mesh rotate smoothly in real-time guided by mouse cursor hover movement and direct pointer drag controls. Includes 360° orbiting, real-time Yaw/Pitch telemetry badges, and 1x default rotation speed controls.
                </p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-2">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>Futuristic Cyberpunk Glassmorphism Architecture</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  High-depth glass panels (<code className="text-purple-300">glass-panel</code>, <code className="text-purple-300">glass-3d-card</code>) with multi-layered specular lighting reflections, inner glow borders, and backdrop blur filters.
                </p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>Audio File Parser & Live Microphone Recorder</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Multi-format drag-and-drop audio file upload (.wav, .mp3, .flac, .ogg, .m4a), real-time browser microphone audio recording with live waveform visualizer, and ASVspoof/DFBench benchmark datasets.
                </p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Comprehensive Forensic Analysis Panels</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Dual Audio Inspector for side-by-side baseline genuine audio vs suspect clone comparison, RT60 Reverberation Decay and Diaphragm Breathing Cadence physics graphs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fastapi' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    API Gateway: Python FastAPI Server (`/backend/main.py`)
                  </h2>
                  <p className="text-xs text-slate-300">
                    FastAPI high-throughput OpenAPI 3.1 gateway serving the Audio Spectrogram Transformer (AST) & Librosa RIR Pipeline.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold">
                FastAPI v0.110.0
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10">
                <span className="text-slate-400 text-[10px] block font-sans">OpenAPI Spec</span>
                <span className="text-cyan-300 font-bold">GET /api/v1/docs</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10">
                <span className="text-slate-400 text-[10px] block font-sans">Inference Endpoint</span>
                <span className="text-emerald-300 font-bold">POST /api/v1/analyze</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10">
                <span className="text-slate-400 text-[10px] block font-sans">Service Health</span>
                <span className="text-purple-300 font-bold">GET /api/v1/health</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center space-x-1.5 text-cyan-400">
                  <Code className="w-4 h-4" />
                  <span>Python FastAPI Code (`/backend/main.py`)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">PyTorch + Librosa + Pydantic</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96 shadow-inner space-y-1">
                <p className="text-purple-400">from fastapi import FastAPI, File, UploadFile, Form</p>
                <p className="text-purple-400">from pydantic import BaseModel</p>
                <p className="text-purple-400">import torch, librosa, numpy as np</p>
                <br />
                <p className="text-slate-500"># FastAPI Application Initialization</p>
                <p className="text-cyan-300">app = FastAPI(title="AcousticSpace FastAPI Forensic Engine", version="2.4.0")</p>
                <br />
                <p className="text-purple-400">@app.post("/api/v1/analyze")</p>
                <p className="text-emerald-300">async def analyze_audio(file: UploadFile = File(...)):</p>
                <p className="pl-4 text-slate-300"># 1. Librosa RIR & Wall Reflection Decay (RT60) extraction</p>
                <p className="pl-4 text-slate-300">rir_metrics = extract_librosa_rir_features(file)</p>
                <p className="pl-4 text-slate-300"># 2. Physiological breathing cadence alignment check</p>
                <p className="pl-4 text-slate-300">breathing = extract_breathing_cadence(file)</p>
                <p className="pl-4 text-slate-300"># 3. Audio Spectrogram Transformer (AST) PyTorch inference</p>
                <p className="pl-4 text-slate-300">verdict = ast_transformer_model.predict(file)</p>
                <p className="pl-4 text-emerald-400">return ForensicReportResponse(verdict=verdict, rir=rir_metrics)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-purple-500/30 bg-purple-950/10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Week-Wise Development Plan (Infotact Solutions)
                </h2>
                <p className="text-xs text-slate-300">
                  4-Week milestone roadmap covering backend machine learning, Librosa RIR feature extraction, FastAPI endpoints, and analyst UI dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Week 1 */}
              <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 bg-slate-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                    WEEK 1
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">Completed ✓</span>
                </div>
                <h3 className="font-bold text-white text-sm">Core Setup & Data Pipeline</h3>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  <li><strong>Backend & ML:</strong> Built FastAPI server architecture, ASVspoof/DFBench dataset curated, Librosa RIR & spectrogram pipeline.</li>
                  <li><strong>Frontend UI:</strong> React app scaffolding, drag-and-drop audio uploader, static dashboard layout.</li>
                </ul>
              </div>

              {/* Week 2 */}
              <div className="glass-card p-4 rounded-2xl border border-purple-500/30 bg-slate-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                    WEEK 2
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">Completed ✓</span>
                </div>
                <h3 className="font-bold text-white text-sm">Baseline Model & Waveform Viz</h3>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  <li><strong>Backend & ML:</strong> Baseline CNN/Transformer classifier evaluating extracted RIR acoustic features.</li>
                  <li><strong>Frontend UI:</strong> Audio waveform visualizers, dynamic spectro-temporal graphs, RIR isolation plots.</li>
                </ul>
              </div>

              {/* Week 3 */}
              <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-slate-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    WEEK 3
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">Completed ✓</span>
                </div>
                <h3 className="font-bold text-white text-sm">Advanced AI & Results Panel</h3>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  <li><strong>Backend & ML:</strong> Fine-tuned HuggingFace Audio Spectrogram Transformer (AST), breathing cadence vs spoken syllable alignment.</li>
                  <li><strong>Frontend UI:</strong> Results panel with model confidence scores, suspicious segment timeline highlights.</li>
                </ul>
              </div>

              {/* Week 4 */}
              <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-slate-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    WEEK 4
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">Completed ✓</span>
                </div>
                <h3 className="font-bold text-white text-sm">Deployment & Interactive Polish</h3>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  <li><strong>Backend & ML:</strong> Containerized ML model via Docker, optimized API inference latency, CI/CD pipeline specs.</li>
                  <li><strong>Frontend UI:</strong> Polished UX, state management for tracking analysis history, complete analyst dashboard.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

