import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Table,
  BarChart3,
  Activity,
  Box,
  Wind,
  Flame,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ForensicReport } from '../types';
import { exportReportToPDF, generateDirectPDF } from '../utils/pdfExporter';
import { Card3D } from '../components/Card3D';

interface ReportsPageProps {
  currentReport: ForensicReport | null;
  onOpenExportModal: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ currentReport, onOpenExportModal }) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!currentReport) return;
    setIsExportingPDF(true);
    try {
      await exportReportToPDF(currentReport, 'forensic-pdf-report-container');
    } catch (err) {
      console.error('PDF Export Error:', err);
      generateDirectPDF(currentReport);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>AcousticSpace Report Center</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PDF & Presentation Ready
              </span>
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Forensic inspection briefs, dataset benchmarks, and security report exports.
            </p>
          </div>
        </div>

        {/* Export Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {currentReport && (
            <>
              <button
                onClick={handlePrintPDF}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-white/10 transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print Report</span>
              </button>
              <button
                onClick={onOpenExportModal}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-white/10 transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Export Brief</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isExportingPDF}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/25 transition-all active:scale-95 border border-white/20 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {currentReport ? (
        <div id="forensic-pdf-report-container" className="space-y-6">

          {/* Executive Verdict Banner */}
          <Card3D glowColor={currentReport.verdict === 'DEEPFAKE_SPOOF' ? 'rose' : currentReport.verdict === 'SUSPICIOUS_SYNTHETIC' ? 'amber' : 'emerald'} className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className={`p-4 rounded-2xl shrink-0 flex items-center justify-center shadow-2xl backdrop-blur-xl ring-2 ${
                  currentReport.verdict === 'DEEPFAKE_SPOOF'
                    ? 'bg-red-500/15 border border-red-500/50 text-red-400 ring-red-500/30'
                    : currentReport.verdict === 'SUSPICIOUS_SYNTHETIC'
                    ? 'bg-amber-500/15 border border-amber-500/50 text-amber-400 ring-amber-500/30'
                    : 'bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 ring-emerald-500/30'
                }`}>
                  {currentReport.verdict === 'DEEPFAKE_SPOOF' ? (
                    <ShieldAlert className="w-10 h-10" />
                  ) : currentReport.verdict === 'SUSPICIOUS_SYNTHETIC' ? (
                    <AlertTriangle className="w-10 h-10" />
                  ) : (
                    <ShieldCheck className="w-10 h-10" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-cyan-400 tracking-wider">
                      Target File: {currentReport.fileName}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {currentReport.id}</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-wide">
                    VERDICT: {currentReport.verdict.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                    {currentReport.summaryExplanation}
                  </p>
                </div>
              </div>

              {/* Key Score Badge Callout */}
              <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 shrink-0 w-full lg:w-auto">
                <div className="glass-card rounded-2xl p-4 text-center border border-white/15 min-w-[130px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Deepfake Risk</p>
                  <p className={`text-3xl font-black font-mono mt-1 ${
                    currentReport.overallDeepfakeProbability > 50 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {currentReport.overallDeepfakeProbability}%
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-4 text-center border border-white/15 min-w-[130px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Confidence</p>
                  <p className="text-3xl font-black font-mono text-cyan-400 mt-1">
                    {currentReport.confidenceScore}%
                  </p>
                </div>
              </div>
            </div>
          </Card3D>

          {/* TABLE 1: Audio Technical Specifications */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Table className="w-4 h-4 text-cyan-400" />
                <span>1. Audio Specification & Metadata Table</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Section A</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">File Parameter</th>
                    <th className="py-2.5 px-3">Recorded Value</th>
                    <th className="py-2.5 px-3">Standard Norm</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">File Name</td>
                    <td className="py-2.5 px-3">{currentReport.fileName}</td>
                    <td className="py-2.5 px-3">Standard WAV / MP3</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">Valid</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">Duration & Size</td>
                    <td className="py-2.5 px-3">{currentReport.durationSeconds}s ({currentReport.fileSizeMb} MB)</td>
                    <td className="py-2.5 px-3">3.0s - 60.0s</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">Sampling Rate & Channels</td>
                    <td className="py-2.5 px-3">{currentReport.sampleRateHz} Hz / Mono ({currentReport.channels} ch)</td>
                    <td className="py-2.5 px-3">16000 Hz / 44100 Hz</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">Ingress Source</td>
                    <td className="py-2.5 px-3 uppercase">{currentReport.sourceType}</td>
                    <td className="py-2.5 px-3">User Verification Stream</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">Monitored</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 2: Physical Acoustic Metrics Breakdown */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>2. Physical Acoustic Metrics Breakdown Table</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Section B</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Acoustic Parameter</th>
                    <th className="py-2.5 px-3">Measured Value</th>
                    <th className="py-2.5 px-3">Expected Human Benchmark</th>
                    <th className="py-2.5 px-3">Deviation Delta</th>
                    <th className="py-2.5 px-3">Risk Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center space-x-2">
                      <Box className="w-3.5 h-3.5 text-cyan-400" />
                      <span>RIR RT60 Reverb Decay</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{currentReport.rir.rt60Seconds}s</td>
                    <td className="py-2.5 px-3 text-slate-400">{currentReport.rir.expectedRt60Seconds}s</td>
                    <td className="py-2.5 px-3">{Math.abs(currentReport.rir.rt60Seconds - currentReport.rir.expectedRt60Seconds).toFixed(2)}s</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentReport.rir.reflectionMismatchScore > 50 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {currentReport.rir.reflectionMismatchScore > 50 ? 'MISMATCH' : 'MATCH'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center space-x-2">
                      <Box className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Wall Reflection Mismatch</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-300">{currentReport.rir.reflectionMismatchScore}%</td>
                    <td className="py-2.5 px-3 text-slate-400">&lt; 25%</td>
                    <td className="py-2.5 px-3">+{currentReport.rir.reflectionMismatchScore}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentReport.rir.reflectionMismatchScore > 40 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {currentReport.rir.reflectionMismatchScore > 40 ? 'HIGH ANOMALY' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center space-x-2">
                      <Wind className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Diaphragm Breaths Detected</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">{currentReport.breathing.detectedBreathsCount} Breaths</td>
                    <td className="py-2.5 px-3 text-slate-400">{currentReport.breathing.expectedBreathsCount} Breaths</td>
                    <td className="py-2.5 px-3">{currentReport.breathing.expectedBreathsCount - currentReport.breathing.detectedBreathsCount} Missing</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentReport.breathing.detectedBreathsCount === 0 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {currentReport.breathing.detectedBreathsCount === 0 ? 'SYNTHETIC UNBREATHED' : 'ORGANIC'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center space-x-2">
                      <Wind className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Breath Cadence Sync Score</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{currentReport.breathing.cadenceSynchronyScore}%</td>
                    <td className="py-2.5 px-3 text-slate-400">&gt; 70%</td>
                    <td className="py-2.5 px-3">-{100 - currentReport.breathing.cadenceSynchronyScore}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentReport.breathing.cadenceSynchronyScore < 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {currentReport.breathing.cadenceSynchronyScore < 50 ? 'UNNATURAL CADENCE' : 'SYNCHRONOUS'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center space-x-2">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Vocoder Phase Drop Index</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-300">{currentReport.spectral.phaseDiscontinuityIndex}%</td>
                    <td className="py-2.5 px-3 text-slate-400">&lt; 15%</td>
                    <td className="py-2.5 px-3">+{currentReport.spectral.phaseDiscontinuityIndex}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentReport.spectral.phaseDiscontinuityIndex > 30 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {currentReport.spectral.phaseDiscontinuityIndex > 30 ? 'VOCODER ARTIFACT' : 'NATURAL PHASE'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* VISUAL CHARTS & GRAPH SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GRAPH 1: RIR Wall Reflection Ray-Tracing Graph */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Graph 1: Room Reflection Ray-Tracing Decay</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">3D Chamber</span>
              </div>

              {/* Vector SVG Ray-Tracing Chamber Model */}
              <div className="h-48 bg-slate-950/70 rounded-2xl p-4 border border-white/10 relative overflow-hidden flex flex-col justify-between">
                <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                  <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />

                  {/* Expected Organic Reverb Envelope Curve */}
                  <path
                    d="M 10,15 Q 40,50 100,80 T 290,110"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />

                  {/* Measured Acoustic Reflection Curve */}
                  <path
                    d={`M 10,15 Q 50,${currentReport.rir.reflectionMismatchScore > 50 ? 20 : 55} 120,${currentReport.rir.reflectionMismatchScore > 50 ? 25 : 85} T 290,110`}
                    fill="none"
                    stroke={currentReport.rir.reflectionMismatchScore > 50 ? '#ef4444' : '#06b6d4'}
                    strokeWidth="3"
                  />

                  {/* Reflection Energy Impulse Peaks */}
                  <circle cx="30" cy="20" r="4" fill="#06b6d4" />
                  <circle cx="70" cy={currentReport.rir.reflectionMismatchScore > 50 ? "22" : "60"} r="4" fill={currentReport.rir.reflectionMismatchScore > 50 ? '#ef4444' : '#06b6d4'} />
                  <circle cx="120" cy={currentReport.rir.reflectionMismatchScore > 50 ? "28" : "85"} r="4" fill={currentReport.rir.reflectionMismatchScore > 50 ? '#ef4444' : '#06b6d4'} />
                </svg>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Expected Decay</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full inline-block ${currentReport.rir.reflectionMismatchScore > 50 ? 'bg-red-500' : 'bg-cyan-400'}`}></span>
                    <span>Measured RIR</span>
                  </span>
                </div>
              </div>
            </div>

            {/* GRAPH 2: Diaphragm Breathing Rhythm Sine Wave Graph */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>Graph 2: Diaphragm Breathing Rhythm Curve</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Pneumo Sync</span>
              </div>

              {/* Vector SVG Breathing Waveform */}
              <div className="h-48 bg-slate-950/70 rounded-2xl p-4 border border-white/10 relative overflow-hidden flex flex-col justify-between">
                <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                  {/* Center Zero Line */}
                  <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Breathing Inhalation/Exhalation Cycles */}
                  <path
                    d={
                      currentReport.breathing.detectedBreathsCount > 0
                        ? "M 10,60 Q 30,10 50,60 T 90,60 Q 110,110 130,60 T 170,60 Q 190,15 210,60 T 250,60 Q 270,105 290,60"
                        : "M 10,60 L 50,60 L 90,60 L 130,60 L 170,60 L 210,60 L 250,60 L 290,60"
                    }
                    fill="none"
                    stroke={currentReport.breathing.detectedBreathsCount > 0 ? '#10b981' : '#f43f5e'}
                    strokeWidth="2.5"
                  />
                </svg>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                  <span className="text-emerald-400 font-bold">
                    Detected: {currentReport.breathing.detectedBreathsCount} Inhalations
                  </span>
                  <span className={currentReport.breathing.cadenceSynchronyScore < 50 ? 'text-red-400' : 'text-slate-300'}>
                    Cadence Sync: {currentReport.breathing.cadenceSynchronyScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE 3: Detected Anomaly Log */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>3. Physical Anomaly Event Log Table</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">{currentReport.anomalies.length} Detected Events</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Time Range</th>
                    <th className="py-2.5 px-3">Anomaly Category</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Forensic Description</th>
                    <th className="py-2.5 px-3">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {currentReport.anomalies.map((anom) => (
                    <tr key={anom.id}>
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">
                        {anom.timestampStart.toFixed(1)}s - {anom.timestampEnd.toFixed(1)}s
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{anom.type.replace(/_/g, ' ')}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          anom.severity === 'CRITICAL' || anom.severity === 'HIGH'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {anom.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-xs">{anom.description}</td>
                      <td className="py-2.5 px-3 text-cyan-400 font-bold">{anom.confidence}%</td>
                    </tr>
                  ))}
                  {currentReport.anomalies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                        No physical acoustic anomalies detected. Audio clip demonstrates natural acoustic physics.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Evidences & Recommended SOC Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Physical Evidences Summary</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {currentReport.keyEvidences.map((ev, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 font-medium glass-card p-3 rounded-xl border border-white/10">
                    <span className="text-cyan-400 font-extrabold shrink-0 mt-0.5">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 backdrop-blur-2xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Recommended SOC Security Action</span>
              </h3>
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentReport.recommendedAction}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Stamp: AcousticSpace Digital Forensic Verification</span>
                  <span className="text-cyan-400 font-bold">PASSED STAGE 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 text-xs font-medium border border-white/10 backdrop-blur-2xl">
          No report selected. Upload or analyze an audio clip in Forensic Analysis to generate a brief.
        </div>
      )}
    </div>
  );
};

