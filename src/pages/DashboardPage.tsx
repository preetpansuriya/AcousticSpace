import React from 'react';
import { ForensicReport, BenchmarkSample } from '../types';
import { AudioUploader } from '../components/AudioUploader';
import { VerdictBanner } from '../components/VerdictBanner';
import { WaveformPlayer } from '../components/WaveformPlayer';
import { SuspiciousRegions } from '../components/SuspiciousRegions';
import { SpectrogramCanvas } from '../components/SpectrogramCanvas';
import { RirVisualizer } from '../components/RirVisualizer';
import { BreathingTimeline } from '../components/BreathingTimeline';
import { ThreeAcousticScene } from '../components/ThreeAcousticScene';
import { SpeakerDiarizationPanel } from '../components/SpeakerDiarizationPanel';
import { WatermarkCard } from '../components/WatermarkCard';
import { Info } from 'lucide-react';

interface DashboardPageProps {
  currentReport: ForensicReport | null;
  benchmarkSamples: BenchmarkSample[];
  isLoading: boolean;
  onAnalyzeFile: (file: File) => void;
  onAnalyzeSample: (sampleId: string) => void;
  onAnalyzeMic: (audioBase64: string, fileName?: string, isFake?: boolean) => void;
  onOpenBulkScanner?: () => void;
  onSliceScan?: (range: { start: number; end: number }) => void;
  onOpenExportModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentReport,
  benchmarkSamples,
  isLoading,
  onAnalyzeFile,
  onAnalyzeSample,
  onAnalyzeMic,
  onOpenBulkScanner,
  onSliceScan,
  onOpenExportModal
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Audio Input & Inspection Controls */}
      <AudioUploader
        onAnalyzeFile={onAnalyzeFile}
        onAnalyzeSample={onAnalyzeSample}
        onAnalyzeMic={onAnalyzeMic}
        onOpenBulkScanner={onOpenBulkScanner}
        benchmarkSamples={benchmarkSamples}
        isLoading={isLoading}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="glass-panel rounded-3xl p-12 text-center shadow-2xl space-y-4 animate-pulse border border-white/10 backdrop-blur-2xl">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto shadow-lg shadow-cyan-500/30"></div>
          <h3 className="text-base font-bold text-slate-100">Running AcousticSpace Forensic Pipeline...</h3>
          <p className="text-xs text-slate-300 font-mono max-w-md mx-auto leading-relaxed">
            Extracting low-level acoustic features, estimating Room Impulse Response (RIR) wall reflections, analyzing diaphragm breathing pauses, running speaker diarization, verifying digital watermarks, and querying Gemini AI reasoning engine.
          </p>
        </div>
      )}

      {/* 2. Primary Forensic Inspection Results */}
      {!isLoading && currentReport && (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <VerdictBanner
            report={currentReport}
            onOpenExportModal={onOpenExportModal}
          />

          {/* Digital AI Watermark Verification Card */}
          <WatermarkCard watermarkInfo={currentReport.watermarkInfo} />

          {/* Interactive Waveform Scrubbing Player & Viewer */}
          <WaveformPlayer report={currentReport} />

          {/* Multi-Speaker Diarization Panel */}
          <SpeakerDiarizationPanel
            segments={currentReport.speakerDiarization}
            durationSeconds={currentReport.durationSeconds}
          />

          {/* 3D Interactive Acoustic WebGL Neural Canvas */}
          <ThreeAcousticScene
            verdict={currentReport.verdict}
            syntheticProbability={currentReport.overallDeepfakeProbability ? currentReport.overallDeepfakeProbability / 100 : 0.97}
            reflectionMismatchScore={currentReport.rir.reflectionMismatchScore}
          />

          {/* Suspicious Regions & RIR Acoustic Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SuspiciousRegions anomalies={currentReport.anomalies} />
            <RirVisualizer rir={currentReport.rir} />
          </div>

          {/* Spectrogram & Slice Analyzer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpectrogramCanvas
              spectral={currentReport.spectral}
              spectrogramMatrix={currentReport.spectrogramData}
              durationSeconds={currentReport.durationSeconds}
              onSliceScan={onSliceScan}
            />

            {/* Key Findings Card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
              <div>
                <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-3">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    Key Forensic Evidence List
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs">
                  {currentReport.keyEvidences.map((evidence, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-300 font-medium">
                      <span className="text-cyan-400 font-extrabold shrink-0 mt-0.5">•</span>
                      <span>{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Confidence Score:</span>
                <span className="font-extrabold text-emerald-400 glass-pill px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">{currentReport.confidenceScore}%</span>
              </div>
            </div>
          </div>

          {/* Breathing Cadence Grid */}
          <BreathingTimeline
            breathing={currentReport.breathing}
            durationSeconds={currentReport.durationSeconds}
          />
        </div>
      )}
    </div>
  );
};
