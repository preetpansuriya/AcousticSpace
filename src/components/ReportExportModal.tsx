import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Printer, Share2, Cloud, Sparkles, Loader2 } from 'lucide-react';
import { ForensicReport } from '../types';
import { exportReportToPDF, generateDirectPDF } from '../utils/pdfExporter';
import { saveReportToFirestore } from '../services/firebaseService';

interface ReportExportModalProps {
  report: ForensicReport;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ report, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(
    report.shareId ? `${window.location.origin}/?share=${report.shareId}` : null
  );
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const formatReportText = () => {
    return `====================================================================
ACOUSTICSPACE - DEEPFAKE AUDIO FORENSICS BRIEF
====================================================================
Report ID:         ${report.id}
Target File:       ${report.fileName}
Duration:          ${report.durationSeconds}s
Timestamp:         ${new Date(report.createdAt).toLocaleString()}
Overall Verdict:   ${report.verdict}
Deepfake Risk:     ${report.overallDeepfakeProbability}%
Analysis Confidence: ${report.confidenceScore}%

SUMMARY EXPLANATION:
--------------------------------------------------------------------
${report.summaryExplanation}

KEY PHYSICAL EVIDENCES (RIR & BREATHING):
--------------------------------------------------------------------
${report.keyEvidences.map(ev => '• ' + ev).join('\n')}

ACOUSTIC METRICS BREAKDOWN:
--------------------------------------------------------------------
- Measured RT60 Reverb Decay:  ${report.rir.rt60Seconds}s (Expected: ${report.rir.expectedRt60Seconds}s)
- Wall Reflection Mismatch:    ${report.rir.reflectionMismatchScore}%
- Clarity C50 Index:           ${report.rir.clarityC50Db} dB
- Diaphragm Breaths Detected:  ${report.breathing.detectedBreathsCount}
- Cadence Synchrony Score:     ${report.breathing.cadenceSynchronyScore}%
- Vocoder Phase Drop Index:    ${report.spectral.phaseDiscontinuityIndex}%

RECOMMENDED ACTION:
--------------------------------------------------------------------
${report.recommendedAction}
====================================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateShareableLink = async () => {
    setIsSavingCloud(true);
    try {
      const shareId = await saveReportToFirestore(report);
      const generatedUrl = `${window.location.origin}/?share=${shareId}`;
      setShareUrl(generatedUrl);
      navigator.clipboard.writeText(generatedUrl);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2500);
    } catch (err) {
      console.error('Error generating share link:', err);
      alert('Could not save to Firebase Cloud. Please check your internet connection.');
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportReportToPDF(report, 'forensic-pdf-report-container');
    } catch (err) {
      console.error('PDF Export error:', err);
      generateDirectPDF(report);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const csvRows = [
      ['Report ID', report.id],
      ['File Name', report.fileName],
      ['Verdict', report.verdict],
      ['Deepfake Probability %', report.overallDeepfakeProbability],
      ['Confidence %', report.confidenceScore],
      ['RT60 (s)', report.rir.rt60Seconds],
      ['RIR Reflection Mismatch %', report.rir.reflectionMismatchScore],
      ['Breaths Detected', report.breathing.detectedBreathsCount],
      ['Vocoder Phase Drop %', report.spectral.phaseDiscontinuityIndex],
      [],
      ['Anomaly ID', 'Start Time (s)', 'End Time (s)', 'Type', 'Severity', 'Description']
    ];

    report.anomalies.forEach(an => {
      csvRows.push([an.id, String(an.timestampStart), String(an.timestampEnd), an.type, an.severity, `"${an.description.replace(/"/g, '""')}"`]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `AcousticSpace_Anomalies_${report.id}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AcousticSpace_ForensicReport_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadText = () => {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(formatReportText());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AcousticSpace_Brief_${report.id}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col border border-white/10 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Forensic Brief Export & Firebase Cloud Sharing</h2>
              <p className="text-xs text-slate-400 font-mono">Scan ID: {report.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Link Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-400/30 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 truncate">
            <Cloud className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="truncate text-xs">
              <p className="font-bold text-slate-100">Permanent Firebase Cloud Link</p>
              <p className="text-[10px] text-slate-300 font-mono truncate">
                {shareUrl || 'Save report to Firebase Firestore for permanent verification link'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateShareableLink}
            disabled={isSavingCloud}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSavingCloud ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : shareLinkCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareUrl ? 'Copy Link' : 'Save & Share'}</span>
              </>
            )}
          </button>
        </div>

        {/* Content Box */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 font-mono text-xs text-slate-200 overflow-y-auto space-y-3 flex-1 backdrop-blur-md">
          <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">
            {formatReportText()}
          </pre>
        </div>

        {/* Export Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all border border-white/15 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all border border-white/15 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center space-x-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-white/15 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-white/15 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all ring-1 ring-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPDF ? 'PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
