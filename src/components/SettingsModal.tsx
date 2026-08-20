import React from 'react';
import { X, Sliders, Shield, Layers, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { AnalysisSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AnalysisSettings;
  onUpdateSettings: (updated: Partial<AnalysisSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const toggleSpectrogramLayer = (layer: keyof AnalysisSettings['spectrogramLayers']) => {
    onUpdateSettings({
      spectrogramLayers: {
        ...settings.spectrogramLayers,
        [layer]: !settings.spectrogramLayers[layer]
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Forensic Engine Settings</h2>
              <p className="text-xs text-slate-400">Configure acoustic detection thresholds and pre-processing filters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Sensitivity / Confidence Threshold Tuning */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-100 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Deepfake Detection Confidence Threshold</span>
            </label>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30 shadow-sm">
              {settings.sensitivityThreshold}%
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min={50}
              max={99}
              step={1}
              value={settings.sensitivityThreshold}
              onChange={(e) => onUpdateSettings({ sensitivityThreshold: Number(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
              <span>50% (Permissive)</span>
              <span>70%</span>
              <span>85%</span>
              <span>95% (Strict SOC)</span>
            </div>
          </div>

          {/* Clean Responsive Presets */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Sensitivity Presets:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 70, label: '70% High Recall' },
                { val: 85, label: '85% Balanced Forensic' },
                { val: 95, label: '95% Strict SOC' }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onUpdateSettings({ sensitivityThreshold: item.val })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                    settings.sensitivityThreshold === item.val
                      ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/90 text-slate-400 border-white/10 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Noise Reduction Pre-processing Filter */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
          <div className="pr-4">
            <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
              <span>Noise Reduction Pre-processing Filter</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Cleans background static hum and wind noise before running RIR analysis</p>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ noiseReductionEnabled: !settings.noiseReductionEnabled })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
              settings.noiseReductionEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-white/15'
            }`}
          >
            {settings.noiseReductionEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* 3. Spectrogram Layer Toggles */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
          <label className="text-xs font-bold text-slate-100 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>3D Spectrogram Overlay Layers</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { key: 'showPitchContour' as const, label: 'Pitch Contour' },
              { key: 'showHarmonics' as const, label: 'Harmonic Series' },
              { key: 'showVocoderMarkers' as const, label: 'Vocoder Phase' }
            ].map((layer) => {
              const active = settings.spectrogramLayers[layer.key];
              return (
                <button
                  key={layer.key}
                  type="button"
                  onClick={() => toggleSpectrogramLayer(layer.key)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-slate-900/60 text-slate-400 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  <span>{layer.label}</span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Active Engine Information (Fixed & Clean) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Active Forensic AI Model</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>AcousticSpace Audio Transformer (PyTorch AST-v2) • Operational</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all cursor-pointer border border-cyan-400/40"
          >
            Save & Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

