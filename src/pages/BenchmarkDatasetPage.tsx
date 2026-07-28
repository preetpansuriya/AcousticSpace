import React from 'react';
import { Database, Play, ExternalLink } from 'lucide-react';
import { BenchmarkSample } from '../types';
import { Card3D } from '../components/Card3D';

interface BenchmarkDatasetPageProps {
  samples: BenchmarkSample[];
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
}

export const BenchmarkDatasetPage: React.FC<BenchmarkDatasetPageProps> = ({
  samples,
  onSelectSample,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                DFBench Speech25 & ASVspoof Benchmark Suite
              </h1>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed font-medium">
              Evaluation benchmark dataset curated from HuggingFace DFBench Speech25 and ASVspoof 2021 datasets. Test AcousticSpace's RIR wall reflection detector against real vs generative AI voice clones.
            </p>
          </div>

          <a
            href="https://huggingface.co/datasets/DFBench/DFBench_Speech25"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-cyan-300 rounded-xl text-xs font-bold flex items-center space-x-2 border border-white/15 transition-all shrink-0 backdrop-blur-md shadow-lg"
          >
            <span>DFBench Dataset</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {samples.map(sample => {
          const isFake = sample.groundTruth === 'FAKE';
          return (
            <Card3D key={sample.id} glowColor={isFake ? 'rose' : 'emerald'} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono backdrop-blur-md border ${
                    isFake
                      ? 'bg-red-500/10 text-red-300 border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}>
                    Ground Truth: {sample.groundTruth}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-medium glass-pill px-2.5 py-0.5 rounded-full border border-white/10">
                    {sample.durationSeconds}s
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{sample.title}</h3>
                <p className="text-xs text-cyan-300 font-semibold">{sample.datasetName}</p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{sample.description}</p>
              </div>

              <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 font-mono">
                  Env: <span className="text-slate-200 font-medium">{sample.targetEnvironment}</span>
                </div>

                <button
                  onClick={() => onSelectSample(sample.id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 ring-1 ring-white/20 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Inspect Audio</span>
                </button>
              </div>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
};
