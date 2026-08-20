import React, { useState, useRef } from 'react';
import { X, Upload, Layers, Play, CheckCircle2, AlertTriangle, Loader2, FileAudio, Trash2 } from 'lucide-react';
import { ForensicReport } from '../types';
import { analyzeFileUpload } from '../services/api';

interface BulkScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCompleted: (reports: ForensicReport[]) => void;
  sensitivityThreshold?: number;
  noiseReductionEnabled?: boolean;
}

interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  report?: ForensicReport;
  errorMsg?: string;
}

export const BulkScannerModal: React.FC<BulkScannerModalProps> = ({
  isOpen,
  onClose,
  onBatchCompleted,
  sensitivityThreshold = 85,
  noiseReductionEnabled = false
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: BatchItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('audio/') || f.name.match(/\.(wav|mp3|flac|ogg|m4a|aac)$/i)) {
        newItems.push({
          id: 'batch_' + Date.now() + '_' + i,
          file: f,
          status: 'pending'
        });
      }
    }
    setBatchItems(prev => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRunBatchScan = async () => {
    if (batchItems.length === 0 || isProcessingBatch) return;

    setIsProcessingBatch(true);
    const completedReports: ForensicReport[] = [];

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      if (item.status === 'done' && item.report) {
        completedReports.push(item.report);
        continue;
      }

      setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'processing' } : it));

      try {
        const report = await analyzeFileUpload(item.file, {
          sensitivityThreshold,
          noiseReductionEnabled
        });
        completedReports.push(report);
        setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'done', report } : it));
      } catch (err: any) {
        setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error', errorMsg: err.message } : it));
      }
    }

    setIsProcessingBatch(false);
    if (completedReports.length > 0) {
      onBatchCompleted(completedReports);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl glass-3d-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-300 rounded-2xl border border-cyan-400/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Bulk Multi-Audio Scanner</h2>
              <p className="text-[10px] text-slate-400">Batch upload and scan multiple WAV/MP3 clips in sequence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag & Drop Add Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer bg-white/5 hover:bg-cyan-500/10 transition-all"
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="audio/*,.wav,.mp3,.flac,.ogg"
            onChange={(e) => handleAddFiles(e.target.files)}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-200">Click or Drag & Drop Multiple Audio Files</p>
          <p className="text-[10px] text-slate-400 mt-1">Select 2 to 20 audio tracks for batch deepfake scan</p>
        </div>

        {/* Batch Items List */}
        {batchItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
              <span>Queue ({batchItems.length} files)</span>
              <button
                onClick={() => setBatchItems([])}
                className="text-[10px] text-rose-400 hover:underline cursor-pointer"
              >
                Clear Queue
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {batchItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <FileAudio className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-100 truncate">{item.file.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {item.status === 'pending' && (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Pending</span>
                    )}
                    {item.status === 'processing' && (
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-full border border-cyan-400/40 flex items-center space-x-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Analyzing...</span>
                      </span>
                    )}
                    {item.status === 'done' && item.report && (
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center space-x-1 ${
                        item.report.verdict === 'DEEPFAKE_SPOOF' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.report.verdict} ({item.report.overallDeepfakeProbability}%)</span>
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-500/40">Error</span>
                    )}

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isProcessingBatch}
                      className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[11px] text-slate-400 font-mono">
            Settings: Threshold {sensitivityThreshold}% | Filter: {noiseReductionEnabled ? 'ON' : 'OFF'}
          </span>

          <button
            onClick={handleRunBatchScan}
            disabled={batchItems.length === 0 || isProcessingBatch}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-xl shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isProcessingBatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Batch...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Batch Scan ({batchItems.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
