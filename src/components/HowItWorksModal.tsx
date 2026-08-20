import React from 'react';
import { X, Cpu, Layers, Waves, Mic, Sparkles, FileCheck, ShieldCheck, Activity } from 'lucide-react';
import { Card3D } from './Card3D';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Acoustic Signal Processing',
      icon: Waves,
      desc: 'The incoming audio track is sampled at high frequency (22.05kHz - 48kHz) and processed into short-time Fourier transforms (STFT) and high-resolution Mel Spectrograms.',
      tech: 'FFT Windowing, Spectral Entropy, Pitch Contours'
    },
    {
      num: '02',
      title: '3D Room Impulse Response (RIR) Physics',
      icon: Cpu,
      desc: 'Real human speech recorded in physical rooms produces early reflections, reverberation decay (RT60), and wall absorption boundaries. Synthetic AI voice generators lack true room impulse physics.',
      tech: 'Eyring/Sabine Reverberation Equations, Early Decay Time'
    },
    {
      num: '03',
      title: 'Diaphragm Breathing Cadence Analysis',
      icon: Mic,
      desc: 'Human vocal cords require periodic lung airflow and involuntary diaphragm inhalation breaks. Neural text-to-speech models often output continuous un-interrupted waveform streams.',
      tech: 'Diaphragm Inhalation Profiler, Silence Gap Energy'
    },
    {
      num: '04',
      title: 'Digital Steganography & AI Watermark Verification',
      icon: Sparkles,
      desc: 'Checks for known AI voice vendor steganographic markers (ElevenLabs, Meta Voicebox, OpenAI Voice, XTTS) hidden in high-frequency spectral phase noise.',
      tech: 'Phase Noise Steganography, Vendor Signature Check'
    },
    {
      num: '05',
      title: 'Gemini 3.6 Forensic Reasoning Engine',
      icon: ShieldCheck,
      desc: 'Combines low-level DSP features with Gemini AI multi-modal reasoning to evaluate acoustic mismatch scores, detect deepfake cloning artifacts, and issue an official forensic report.',
      tech: 'Multi-Modal Reasoning, Certified Forensic PDF Brief'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <Card3D glowColor="cyan" className="w-full max-w-2xl p-6 space-y-6 relative overflow-hidden my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center space-x-2">
              <span>How AcousticSpace Works</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-400/30">
                5-Stage Pipeline
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              End-to-end physical acoustic reverberation & deepfake voice verification architecture
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/40 transition-all flex items-start space-x-4"
              >
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30 mb-2">
                    {step.num}
                  </span>
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono text-cyan-300">
                    <span className="text-slate-500 font-bold">Tech:</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{step.tech}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Deterministic RIR Physics + Multi-Modal AI</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </Card3D>
    </div>
  );
};
