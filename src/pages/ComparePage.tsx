import React, { useState } from 'react';
import { BenchmarkSample, ForensicReport } from '../types';
import { analyzeBenchmarkSample, analyzeFileUpload } from '../services/api';
import { ArrowLeftRight, Upload, Activity, Sparkles, Sliders } from 'lucide-react';
import { Card3D } from '../components/Card3D';

interface ComparePageProps {
  benchmarkSamples: BenchmarkSample[];
}

export const ComparePage: React.FC<ComparePageProps> = ({ benchmarkSamples }) => {
  const [sampleAId, setSampleAId] = useState<string>(benchmarkSamples[0]?.id || 'sample-real-1');
  const [sampleBId, setSampleBId] = useState<string>(benchmarkSamples[1]?.id || 'sample-elevenlabs-1');

  const [reportA, setReportA] = useState<ForensicReport | null>(null);
  const [reportB, setReportB] = useState<ForensicReport | null>(null);

  const [isLoadingA, setIsLoadingA] = useState<boolean>(false);
  const [isLoadingB, setIsLoadingB] = useState<boolean>(false);

  const handleRunComparison = async () => {
    setIsLoadingA(true);
    setIsLoadingB(true);
    try {
      const [resA, resB] = await Promise.all([
        analyzeBenchmarkSample(sampleAId),
        analyzeBenchmarkSample(sampleBId)
      ]);
      setReportA(resA);
      setReportB(resB);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsLoadingA(false);
      setIsLoadingB(false);
    }
  };

  const handleFileUploadA = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoadingA(true);
    try {
      const res = await analyzeFileUpload(file);
      setReportA(res);
    } catch (err) {
      alert('Failed to analyze Sample A');
    } finally {
      setIsLoadingA(false);
    }
  };

  const handleFileUploadB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoadingB(true);
    try {
      const res = await analyzeFileUpload(file);
      setReportB(res);
    } catch (err) {
      alert('Failed to analyze Sample B');
    } finally {
      setIsLoadingB(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-3d-card rounded-3xl p-6 shadow-2xl border border-white/15 backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl glass-3d-button text-cyan-300 shadow-xl">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              A/B Dual Audio Forensic Comparison
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Compare two speech files side-by-side to isolate RIR room reflection shifts, vocoder artifacts, and breathing cadence deltas.
            </p>
          </div>
        </div>

        <button
          id="btn-run-dual-compare"
          onClick={handleRunComparison}
          disabled={isLoadingA || isLoadingB}
          className="px-5 py-3 glass-3d-button text-white font-bold text-xs rounded-2xl flex items-center space-x-2 shadow-xl shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Execute A/B Delta Analysis</span>
        </button>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample A Selector */}
        <Card3D glowColor="cyan" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs">A</span>
              <span>Primary Reference Sample A</span>
            </span>
            <label className="cursor-pointer glass-pill px-3 py-1 rounded-xl text-[11px] font-bold text-slate-200 border border-white/15 hover:bg-white/10 flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Custom A</span>
              <input type="file" accept="audio/*" onChange={handleFileUploadA} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase text-slate-300 block mb-1.5">Select Preset Benchmark</label>
            <select
              value={sampleAId}
              onChange={(e) => setSampleAId(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/20 text-xs text-slate-100 rounded-xl p-3 focus:outline-none focus:border-cyan-400"
            >
              {benchmarkSamples.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">{s.title} ({s.datasetName})</option>
              ))}
            </select>
          </div>

          {reportA && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{reportA.fileName}</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  reportA.verdict === 'DEEPFAKE_SPOOF' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {reportA.verdict}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Deepfake</p>
                  <p className="text-cyan-400 font-black">{reportA.overallDeepfakeProbability}%</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">RT60</p>
                  <p className="text-white font-black">{reportA.rir.rt60Seconds}s</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Breaths</p>
                  <p className="text-emerald-400 font-black">{reportA.breathing.detectedBreathsCount}</p>
                </div>
              </div>
            </div>
          )}
        </Card3D>

        {/* Sample B Selector */}
        <Card3D glowColor="purple" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-xs">B</span>
              <span>Target Audio Sample B</span>
            </span>
            <label className="cursor-pointer glass-pill px-3 py-1 rounded-xl text-[11px] font-bold text-slate-200 border border-white/15 hover:bg-white/10 flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload Custom B</span>
              <input type="file" accept="audio/*" onChange={handleFileUploadB} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase text-slate-300 block mb-1.5">Select Preset Benchmark</label>
            <select
              value={sampleBId}
              onChange={(e) => setSampleBId(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/20 text-xs text-slate-100 rounded-xl p-3 focus:outline-none focus:border-purple-400"
            >
              {benchmarkSamples.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">{s.title} ({s.datasetName})</option>
              ))}
            </select>
          </div>

          {reportB && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{reportB.fileName}</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  reportB.verdict === 'DEEPFAKE_SPOOF' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {reportB.verdict}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Deepfake</p>
                  <p className="text-purple-400 font-black">{reportB.overallDeepfakeProbability}%</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">RT60</p>
                  <p className="text-white font-black">{reportB.rir.rt60Seconds}s</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Breaths</p>
                  <p className="text-emerald-400 font-black">{reportB.breathing.detectedBreathsCount}</p>
                </div>
              </div>
            </div>
          )}
        </Card3D>
      </div>

      {/* Comparison Delta Matrix Results */}
      {reportA && reportB && (
        <div className="glass-3d-card rounded-3xl p-6 border border-white/15 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Comparative Forensic Metric Matrix (A vs B)</span>
            </h2>
            <span className="text-xs text-slate-300 font-mono glass-pill px-3 py-1 rounded-full border border-white/10">
              Delta Variance Calculated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Metric 1: Deepfake Risk */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
              <p className="text-[10px] uppercase font-extrabold text-slate-300">Deepfake Risk Probability</p>
              <div className="flex justify-between items-center font-mono font-black text-sm">
                <span className="text-cyan-400">A: {reportA.overallDeepfakeProbability}%</span>
                <span className="text-purple-400">B: {reportB.overallDeepfakeProbability}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-500 h-full" style={{ width: `${reportA.overallDeepfakeProbability}%` }} />
                <div className="bg-purple-500 h-full" style={{ width: `${reportB.overallDeepfakeProbability}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Variance: <strong className="text-white">{Math.abs(reportA.overallDeepfakeProbability - reportB.overallDeepfakeProbability)}%</strong> difference in AI neural synthesis risk.
              </p>
            </div>

            {/* Metric 2: RIR Reverberation Mismatch */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
              <p className="text-[10px] uppercase font-extrabold text-slate-300">Room Impulse Wall Mismatch</p>
              <div className="flex justify-between items-center font-mono font-black text-sm">
                <span className="text-cyan-400">A: {reportA.rir.reflectionMismatchScore}%</span>
                <span className="text-purple-400">B: {reportB.rir.reflectionMismatchScore}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Sample A RT60: {reportA.rir.rt60Seconds}s | Sample B RT60: {reportB.rir.rt60Seconds}s.
                {Math.abs(reportA.rir.rt60Seconds - reportB.rir.rt60Seconds) > 0.15 ? ' High acoustic room mismatch detected!' : ' Compatible room reverb.'}
              </p>
            </div>

            {/* Metric 3: Diaphragm Breathing Cadence */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
              <p className="text-[10px] uppercase font-extrabold text-slate-300">Breathing Inhalations</p>
              <div className="flex justify-between items-center font-mono font-black text-sm">
                <span className="text-cyan-400">A: {reportA.breathing.detectedBreathsCount} Inhalations</span>
                <span className="text-purple-400">B: {reportB.breathing.detectedBreathsCount} Inhalations</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Cadence A: {reportA.breathing.cadenceSynchronyScore}% vs B: {reportB.breathing.cadenceSynchronyScore}%.
              </p>
            </div>
          </div>

          {/* Forensic Comparison Summary Card */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1.5 text-cyan-200">
            <div className="flex items-center space-x-2 font-bold text-white">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Comparative Forensic Summary</span>
            </div>
            <p className="leading-relaxed">
              {reportA.verdict === reportB.verdict ? (
                <>Both samples share identical class predictions ({reportA.verdict}). However, Sample A exhibits an RT60 acoustic decay of {reportA.rir.rt60Seconds}s while Sample B exhibits {reportB.rir.rt60Seconds}s.</>
              ) : (
                <>Sample A ({reportA.verdict}) and Sample B ({reportB.verdict}) exhibit opposing acoustic signatures. Sample B demonstrates neural vocoder energy distribution differences with an RT60 room mismatch delta of {Math.abs(reportA.rir.rt60Seconds - reportB.rir.rt60Seconds).toFixed(2)}s.</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
