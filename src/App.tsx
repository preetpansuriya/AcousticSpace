import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Database, History, FileText, HelpCircle, ArrowLeftRight, Mic, ArrowLeft, Layers, Sliders, Sparkles } from 'lucide-react';
import { ForensicReport, BenchmarkSample, AnalysisHistoryItem, AnalysisSettings } from './types';
import {
  fetchHealth,
  fetchBenchmarkSamples,
  analyzeBenchmarkSample,
  analyzeFileUpload,
  analyzeMicrophoneRecording,
  fetchHistory,
  fetchReportById,
  deleteHistoryItem
} from './services/api';
import { initAuthSession, fetchReportByShareId } from './services/firebaseService';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ComparePage } from './pages/ComparePage';
import { BenchmarkDatasetPage } from './pages/BenchmarkDatasetPage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelDocsPage } from './pages/ModelDocsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LiveMicPage } from './pages/LiveMicPage';
import { ReportExportModal } from './components/ReportExportModal';
import { BulkScannerModal } from './components/BulkScannerModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { HowItWorksModal } from './components/HowItWorksModal';

const ParticleBackground3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 800 + 100,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(168, 85, 247, '
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (Math.abs(p1.x) > width) p1.x = -p1.x;
        if (Math.abs(p1.y) > height) p1.y = -p1.y;

        const fov = 400;
        const scale = fov / (fov + p1.z);
        const px = cx + p1.x * scale;
        const py = cy + p1.y * scale;

        const size = Math.max(0.5, p1.radius * scale * 1.5);
        const alpha = Math.min(0.6, (1 - p1.z / 900) * 0.5);

        ctx.fillStyle = `${p1.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const scale2 = fov / (fov + p2.z);
            const px2 = cx + p2.x * scale2;
            const py2 = cy + p2.y * scale2;
            const lineAlpha = (1 - dist / 180) * 0.15;

            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};

const OpeningSplash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('INITIALIZING ACOUSTIC NEURAL ENGINE...');

  useEffect(() => {
    const timer1 = setTimeout(() => { setProgress(30); setStatusText('CALIBRATING 3D SPECTROGRAM SPECTRUM...'); }, 300);
    const timer2 = setTimeout(() => { setProgress(65); setStatusText('SYNCHRONIZING BIOMETRIC VOICE PRINTS...'); }, 750);
    const timer3 = setTimeout(() => { setProgress(90); setStatusText('AUTHENTICATING SECURITY HANDSHAKE...'); }, 1200);
    const timer4 = setTimeout(() => { setProgress(100); setStatusText('SYSTEM ACCESS GRANTED'); }, 1600);
    const timer5 = setTimeout(() => { onComplete(); }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white p-6 overflow-hidden select-none"
    >
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Holographic Glowing Orbs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/20 blur-[120px]"
        />
      </div>

      {/* 3D Holographic Sonar Radar Sweep Animation */}
      <div className="relative z-10 text-center max-w-md space-y-7 flex flex-col items-center">
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Outer Rotating Target Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30"
          />

          {/* Inner Counter-Rotating Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-blue-400/20 border-t-cyan-400 border-r-transparent"
          />

          {/* Radar Radar Sweeper Line */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full origin-center pointer-events-none flex items-center justify-center"
          >
            <div className="w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent absolute right-0 top-1/2 -translate-y-1/2 origin-left shadow-[0_0_10px_#22d3ee]" />
          </motion.div>

          {/* Concentric Sonar Pulses */}
          <motion.div
            animate={{ scale: [0.2, 1.1], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-cyan-400/60 bg-cyan-500/10"
          />
          <motion.div
            animate={{ scale: [0.2, 1.1], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
            className="absolute inset-0 rounded-full border border-blue-400/60 bg-blue-500/10"
          />

          {/* Central Holographic Icon Container */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative z-20 w-20 h-20 rounded-2xl bg-slate-900/90 border border-cyan-400/50 p-3 shadow-2xl shadow-cyan-500/50 backdrop-blur-xl flex items-center justify-center"
          >
            <Activity className="w-10 h-10 text-cyan-400 animate-pulse" />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-md"
            />
          </motion.div>
        </div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <h1 className="text-2xl md:text-3xl font-black tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-blue-300 uppercase">
              AcousticSpace
            </h1>
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400/90 font-mono">
            3D Forensics & Acoustic Deepfake Engine
          </p>
        </motion.div>

        {/* Dynamic Equalizer Bars Wave */}
        <div className="flex items-center justify-center space-x-1 h-8 px-4">
          {[35, 75, 40, 95, 60, 100, 50, 85, 45, 90, 30, 80, 55, 70, 40].map((h, idx) => (
            <motion.span
              key={idx}
              animate={{ height: ['15%', `${h}%`, '15%'] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: idx * 0.06 }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-500 via-blue-400 to-indigo-300 shadow-[0_0_6px_#06b6d4]"
            />
          ))}
        </div>

        {/* High-Tech Progress Matrix */}
        <div className="w-full space-y-2">
          <div className="w-full h-2.5 bg-slate-900 border border-cyan-500/30 rounded-full overflow-hidden p-0.5 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_12px_#22d3ee]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-cyan-300 font-bold tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block mr-1"></span>
              {statusText}
            </span>
            <span className="text-slate-400 font-extrabold">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isSplashShowing, setIsSplashShowing] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [benchmarkSamples, setBenchmarkSamples] = useState<BenchmarkSample[]>([]);
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [currentReport, setCurrentReport] = useState<ForensicReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isBulkScannerOpen, setIsBulkScannerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string; isGuest?: boolean } | null>(null);

  const [settings, setSettings] = useState<AnalysisSettings>({
    sensitivityThreshold: 85,
    noiseReductionEnabled: false,
    customFastApiUrl: 'http://localhost:8000/api/v1/analyze',
    themeMode: 'cyberpunk',
    customBrandingName: 'AcousticSpace',
    customBrandingLogoText: '3D Forensics',
    spectrogramLayers: {
      showPitchContour: true,
      showHarmonics: true,
      showVocoderMarkers: true,
    },
    roomSettings: {
      lengthMeters: 6.5,
      widthMeters: 5.0,
      heightMeters: 3.2,
      material: 'Concrete',
      absorptionCoefficient: 0.02,
    }
  });

  const handleUpdateSettings = (updated: Partial<AnalysisSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  // Initialize data on mount & Firebase auth / share link handling
  useEffect(() => {
    async function loadInitialData() {
      try {
        await initAuthSession().catch(err => console.warn('Auth session init warning:', err));

        try {
          const health = await fetchHealth();
          setGeminiActive(health.geminiActive);
        } catch (e) {
          console.warn('Health check fallback:', e);
        }

        try {
          const samples = await fetchBenchmarkSamples();
          setBenchmarkSamples(samples);
        } catch (e) {
          console.warn('Samples fetch fallback:', e);
        }

        let history: AnalysisHistoryItem[] = [];
        try {
          history = await fetchHistory();
          setHistoryItems(history);
        } catch (e) {
          console.warn('History fetch fallback:', e);
        }

        // Check for Firebase Cloud Share URL parameter (?share=xyz)
        const params = new URLSearchParams(window.location.search);
        const shareId = params.get('share');
        if (shareId) {
          try {
            const sharedReport = await fetchReportByShareId(shareId);
            if (sharedReport) {
              setCurrentReport(sharedReport);
              setActiveTab('dashboard');
              return;
            }
          } catch (e) {
            console.warn('Share report fetch fallback:', e);
          }
        }

        // Load initial seed report if available
        if (history.length > 0) {
          try {
            const firstReport = await fetchReportById(history[0].id);
            setCurrentReport(firstReport);
          } catch (e) {
            console.warn('First report fetch fallback:', e);
          }
        }
      } catch (err) {
        console.warn('Initialization notice:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handlers for analysis
  const handleAnalyzeFile = async (file: File, optionsExtra?: any) => {
    setIsLoading(true);
    try {
      const report = await analyzeFileUpload(file, {
        sensitivityThreshold: settings.sensitivityThreshold,
        noiseReductionEnabled: settings.noiseReductionEnabled,
        ...optionsExtra
      });
      setCurrentReport(report);
      setActiveTab('dashboard');
      const history = await fetchHistory();
      setHistoryItems(history);
    } catch (err: any) {
      alert('File analysis failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeSample = async (sampleId: string, optionsExtra?: any) => {
    setIsLoading(true);
    try {
      const report = await analyzeBenchmarkSample(sampleId, {
        sensitivityThreshold: settings.sensitivityThreshold,
        noiseReductionEnabled: settings.noiseReductionEnabled,
        ...optionsExtra
      });
      setCurrentReport(report);
      setActiveTab('dashboard');
      const history = await fetchHistory();
      setHistoryItems(history);
    } catch (err: any) {
      alert('Benchmark analysis failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeMic = async (audioBase64: string, fileName?: string, isFake?: boolean) => {
    setIsLoading(true);
    try {
      const report = await analyzeMicrophoneRecording(audioBase64, fileName, isFake, {
        sensitivityThreshold: settings.sensitivityThreshold,
        noiseReductionEnabled: settings.noiseReductionEnabled
      });
      setCurrentReport(report);
      setActiveTab('dashboard');
      const history = await fetchHistory();
      setHistoryItems(history);
    } catch (err: any) {
      alert('Recording analysis failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliceScan = async (sliceRange: { start: number; end: number }) => {
    if (!currentReport) return;
    setIsLoading(true);
    try {
      if (currentReport.sampleId) {
        await handleAnalyzeSample(currentReport.sampleId, { sliceRange });
      } else {
        // Run with current report sample or mic
        const report = await analyzeBenchmarkSample('elevenlabs_synth_1', {
          sensitivityThreshold: settings.sensitivityThreshold,
          noiseReductionEnabled: settings.noiseReductionEnabled,
          sliceRange
        });
        setCurrentReport(report);
      }
    } catch (err: any) {
      console.error('Slice scan failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchCompleted = async (newReports: ForensicReport[]) => {
    if (newReports.length > 0) {
      setCurrentReport(newReports[newReports.length - 1]);
      setActiveTab('dashboard');
      const history = await fetchHistory();
      setHistoryItems(history);
    }
  };

  const handleSelectHistoryReport = async (reportId: string) => {
    try {
      setIsLoading(true);
      const report = await fetchReportById(reportId);
      setCurrentReport(report);
      setActiveTab('dashboard');
    } catch (err) {
      alert('Could not load selected report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistoryReport = async (reportId: string) => {
    try {
      await deleteHistoryItem(reportId);
      const history = await fetchHistory();
      setHistoryItems(history);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className={`min-h-screen bg-glass-gradient ${settings.themeMode === 'light' ? 'text-slate-900' : 'text-slate-100'} flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden theme-${settings.themeMode}`}>
      {/* Cool Opening Splash Animation on Website Load */}
      <AnimatePresence>
        {isSplashShowing && (
          <OpeningSplash onComplete={() => setIsSplashShowing(false)} />
        )}
      </AnimatePresence>

      {/* Interactive 3D Ambient Particle Background */}
      <ParticleBackground3D />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geminiActive={geminiActive}
        historyCount={historyItems.length}
        onOpenBulkScanner={() => setIsBulkScannerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        themeMode={settings.themeMode}
        onToggleTheme={() =>
          handleUpdateSettings({
            themeMode: settings.themeMode === 'light' ? 'cyberpunk' : 'light'
          })
        }
        customBrandingName={settings.customBrandingName}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 relative">
          {/* Ambient 3D Dynamic Floating Light Nodes */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" style={{ animationDelay: '3s' }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* HOME PORTAL LAUNCHER VIEW */}
              {activeTab === 'home' && (
                <div className="space-y-8 py-6 max-w-6xl mx-auto">
                  {/* Hero Header */}
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold backdrop-blur-md">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>3D Forensic Analysis Portal</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                      AcousticSpace Forensic Suite
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto font-medium">
                      Select a forensic module below to launch deepfake detection, room impulse response (RIR) spatial acoustics, or live audio verification.
                    </p>
                  </div>

                  {/* Module Launcher Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      {
                        id: 'dashboard',
                        title: 'Forensic Analysis',
                        desc: 'Primary 3D acoustic inspection engine for Room Impulse Response (RIR), human breathing cadence & bulk multi-audio scanning.',
                        icon: Activity,
                        color: 'from-cyan-500 via-blue-600 to-indigo-600',
                        badge: 'Core Engine'
                      },
                      {
                        id: 'live-mic',
                        title: 'Live Mic Inspection',
                        desc: 'Real-time live audio capture from microphone for instant spatial acoustic verification.',
                        icon: Mic,
                        color: 'from-rose-500 via-pink-600 to-purple-600',
                        badge: 'Live Audio'
                      },
                      {
                        id: 'compare',
                        title: 'Dual Inspector',
                        desc: 'Side-by-side comparative inspection between authentic human speech and synthetic AI audio tracks.',
                        icon: ArrowLeftRight,
                        color: 'from-purple-500 via-indigo-600 to-blue-600',
                        badge: 'Compare'
                      },
                      {
                        id: 'benchmarks',
                        title: 'DFBench Suite',
                        desc: 'Access pre-analyzed benchmark datasets across ElevenLabs, XTTS, Bark, and human speaker samples.',
                        icon: Database,
                        color: 'from-amber-500 via-orange-600 to-red-600',
                        badge: 'Dataset'
                      },
                      {
                        id: 'history',
                        title: 'Analysis History',
                        desc: 'Review past forensic inspection logs, confidence metrics, and saved analysis records.',
                        icon: History,
                        color: 'from-emerald-500 via-teal-600 to-cyan-600',
                        badge: `${historyItems.length} Records`
                      },
                      {
                        id: 'reports',
                        title: 'Forensic Reports',
                        desc: 'Export official forensic analysis certificates in PDF brief or structured JSON formats.',
                        icon: FileText,
                        color: 'from-blue-500 via-cyan-600 to-teal-600',
                        badge: 'Export'
                      },
                      {
                        id: 'docs',
                        title: 'Physics Architecture',
                        desc: 'Explore the mathematical foundation, room reflection physics, and spectrogram parameters.',
                        icon: HelpCircle,
                        color: 'from-indigo-500 via-purple-600 to-pink-600',
                        badge: 'Docs'
                      },
                      {
                        id: 'how-it-works',
                        title: 'How It Works Pipeline',
                        desc: 'Interactive 5-stage pipeline walkthrough from acoustic signal extraction to certified forensic reports.',
                        icon: Sparkles,
                        color: 'from-cyan-400 via-teal-500 to-emerald-600',
                        badge: 'Walkthrough',
                        isAction: () => setIsHowItWorksOpen(true)
                      }
                    ].map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            if (mod.isAction) {
                              mod.isAction();
                            } else {
                              setActiveTab(mod.id);
                            }
                          }}
                          className="group relative text-left p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/15 hover:border-cyan-400/60 shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-4 overflow-hidden"
                        >
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${mod.color} opacity-10 rounded-bl-full pointer-events-none group-hover:opacity-25 transition-opacity`} />
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className={`p-3 rounded-2xl bg-gradient-to-tr ${mod.color} text-white shadow-lg ring-1 ring-white/20`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/15">
                                {mod.badge}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {mod.title}
                            </h3>
                            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                              {mod.desc}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 text-xs font-extrabold text-cyan-400 group-hover:text-cyan-300 pt-3 border-t border-white/10">
                            <span>Launch {mod.title}</span>
                            <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeTab === 'dashboard' && (
                <DashboardPage
                  currentReport={currentReport}
                  benchmarkSamples={benchmarkSamples}
                  isLoading={isLoading}
                  onAnalyzeFile={handleAnalyzeFile}
                  onAnalyzeSample={handleAnalyzeSample}
                  onAnalyzeMic={handleAnalyzeMic}
                  onOpenBulkScanner={() => setIsBulkScannerOpen(true)}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  onSliceScan={handleSliceScan}
                />
              )}

              {activeTab === 'live-mic' && (
                <LiveMicPage
                  onAnalyzeMic={handleAnalyzeMic}
                  isLoading={isLoading}
                  currentReport={currentReport}
                />
              )}

              {activeTab === 'compare' && (
                <ComparePage benchmarkSamples={benchmarkSamples} />
              )}

              {activeTab === 'benchmarks' && (
                <BenchmarkDatasetPage
                  samples={benchmarkSamples}
                  onSelectSample={handleAnalyzeSample}
                  isLoading={isLoading}
                />
              )}

              {activeTab === 'history' && (
                <HistoryPage
                  historyItems={historyItems}
                  onSelectReport={handleSelectHistoryReport}
                  onDeleteReport={handleDeleteHistoryReport}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsPage
                  currentReport={currentReport}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}

              {activeTab === 'docs' && <ModelDocsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Export Report Brief Modal */}
      {isExportModalOpen && currentReport && (
        <ReportExportModal
          report={currentReport}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Bulk Audio Batch Scanner Modal */}
      {isBulkScannerOpen && (
        <BulkScannerModal
          isOpen={isBulkScannerOpen}
          onClose={() => setIsBulkScannerOpen(false)}
          onBatchCompleted={handleBatchCompleted}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}

      {/* Auth / Sign In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(email) => setCurrentUser({ email })}
        onLogout={() => setCurrentUser(null)}
      />

      {/* How It Works Pipeline Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
