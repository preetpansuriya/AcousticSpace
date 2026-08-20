import React from 'react';
import { ForensicReport, BenchmarkSample } from '../types';
import { AudioUploader } from './AudioUploader';
import { VerdictBanner } from './VerdictBanner';
import { WaveformViewer } from './WaveformViewer';
import { SuspiciousRegions } from './SuspiciousRegions';
import { RirVisualizer } from './RirVisualizer';
import { BreathingTimeline } from './BreathingTimeline';
import { Cpu, Download } from 'lucide-react';

interface DashboardProps {
  currentReport: ForensicReport | null;
  benchmarkSamples: BenchmarkSample[];
  isLoading: boolean;
  onAnalyzeFile: (file: File) => void;
  onAnalyzeSample: (sampleId: string) => void;
  onAnalyzeMic: (audioBase64: string, fileName?: string, isFake?: boolean) => void;
  onOpenExportModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentReport,
  benchmarkSamples,
  isLoading,
  onAnalyzeFile,
  onAnalyzeSample,
  onAnalyzeMic,
  onOpenExportModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AudioUploader
            onAnalyzeFile={onAnalyzeFile}
            onAnalyzeSample={onAnalyzeSample}
            onAnalyzeMic={onAnalyzeMic}
            benchmarkSamples={benchmarkSamples}
            isLoading={isLoading}
          />
        </div>

        {/* Quick Report Summary Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Forensic Engine Status</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                AST + RIR ONLINE
              </span>
            </div>

            {currentReport ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>File Analyzed:</span>
                  <span className="font-mono font-bold text-cyan-300 truncate max-w-[150px]">
                    {currentReport.fileName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Duration:</span>
                  <span className="font-mono text-slate-200">{currentReport.durationSeconds}s</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Deepfake Prob:</span>
                  <span className="font-mono font-extrabold text-cyan-400">
                    {currentReport.overallDeepfakeProbability}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select an audio file or benchmark sample above to begin deepfake forensic detection.</p>
            )}
          </div>

          {currentReport && (
            <button
              onClick={onOpenExportModal}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Forensic Brief PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Analysis Display */}
      {currentReport && (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <VerdictBanner report={currentReport} onOpenExportModal={onOpenExportModal} />

          {/* Interactive Waveform Viewer */}
          <WaveformViewer report={currentReport} />

          {/* Suspicious Regions & RIR Acoustic Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SuspiciousRegions anomalies={currentReport.anomalies} />
            <RirVisualizer rir={currentReport.rir} />
          </div>

          {/* Breathing Respiration Timeline */}
          <BreathingTimeline breathing={currentReport.breathing} durationSeconds={currentReport.durationSeconds} />
        </div>
      )}
    </div>
  );
};
