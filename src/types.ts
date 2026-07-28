/**
 * AcousticSpace - Data Types & Forensics Interfaces
 */

export type AudioSourceType = 'upload' | 'mic' | 'benchmark';

export type ForensicVerdict = 'AUTHENTIC' | 'SUSPICIOUS_SYNTHETIC' | 'DEEPFAKE_SPOOF';

export interface RirMetrics {
  rt60Seconds: number;               // Reverb Time (60dB decay)
  expectedRt60Seconds: number;       // Expected RT60 for ambient environment
  earlyDecayTimeEdt: number;         // EDT in seconds
  reflectionMismatchScore: number;   // 0 to 100% mismatch
  clarityC50Db: number;              // Speech clarity ratio C50
  estimatedRoomVolumeM3: number;     // Estimated room size in cubic meters
  reflectionPeaksCount: number;      // Number of specular wall reflections detected
  decayPatternConsistency: number;   // 0 to 100%
}

export interface BreathingMetrics {
  detectedBreathsCount: number;
  expectedBreathsCount: number;
  cadenceSynchronyScore: number;     // 0 to 100%
  unnaturalPauseRatio: number;      // 0 to 100%
  diaphragmRechargePresent: boolean;
  breathSpans: Array<{ start: number; end: number; energyDb: number }>;
}

export interface SpectralMetrics {
  spectralCentroidHz: number;
  highFreqRolloffHz: number;
  zeroCrossingRate: number;
  phaseDiscontinuityIndex: number;  // Vocoder phase artifact index 0-100%
  mfccVariance: number;
  melEnergyKurtosis: number;
}

export interface ForensicAnomaly {
  id: string;
  timestampStart: number; // in seconds
  timestampEnd: number;
  type: 'RIR_MISMATCH' | 'VOCODER_PHASE_DROP' | 'MISSING_BREATH' | 'SPECTRAL_SPLICE' | 'SYNTHETIC_OVERFREEZE' | string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  confidence: number;
}

export type AcousticAnomaly = ForensicAnomaly;

export interface ForensicReport {
  id: string;
  fileName: string;
  fileSizeMb: number;
  durationSeconds: number;
  sampleRateHz: number;
  channels: number;
  sourceType: AudioSourceType;
  createdAt: string;
  
  verdict: ForensicVerdict;
  overallDeepfakeProbability: number; // 0 to 100%
  confidenceScore: number;            // 0 to 100%
  
  rir: RirMetrics;
  breathing: BreathingMetrics;
  spectral: SpectralMetrics;
  anomalies: ForensicAnomaly[];
  
  summaryExplanation: string;
  keyEvidences: string[];
  recommendedAction: string;
  
  spectrogramData?: number[][];      // 2D matrix for visualization
  waveformPoints?: number[];         // Normalized audio samples for preview
}

export interface BenchmarkSample {
  id: string;
  title: string;
  datasetName: string;               // e.g. "DFBench Speech25", "ASVspoof 2021"
  category: 'Authentic' | 'Deepfake AI Clone' | 'Spliced Hybrid' | 'TTS Voice';
  groundTruth: 'REAL' | 'FAKE';
  durationSeconds: number;
  description: string;
  targetEnvironment: string;
  expectedVerdict: ForensicVerdict;
  waveType: 'sine_speech' | 'flat_ai' | 'reverb_room' | 'spliced';
}

export interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  timestamp: string;
  verdict: ForensicVerdict;
  deepfakeProb: number;
  duration: number;
  sourceType: AudioSourceType;
}
