import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Database, History, FileText, HelpCircle, ArrowLeftRight, Mic, ArrowLeft } from 'lucide-react';
import { ForensicReport, BenchmarkSample, AnalysisHistoryItem } from './types';
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
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ComparePage } from './pages/ComparePage';
import { BenchmarkDatasetPage } from './pages/BenchmarkDatasetPage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelDocsPage } from './pages/ModelDocsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LiveMicPage } from './pages/LiveMicPage';
import { ReportExportModal } from './components/ReportExportModal';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentTheme] = useState<string>('theme-cyberpunk');
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [benchmarkSamples, setBenchmarkSamples] = useState<BenchmarkSample[]>([]);
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [currentReport, setCurrentReport] = useState<ForensicReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const health = await fetchHealth();
        setGeminiActive(health.geminiActive);

        const samples = await fetchBenchmarkSamples();
        setBenchmarkSamples(samples);

        const history = await fetchHistory();
        setHistoryItems(history);

        // Load initial seed report if available
        if (history.length > 0) {
          const firstReport = await fetchReportById(history[0].id);
          setCurrentReport(firstReport);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handlers for analysis
  const handleAnalyzeFile = async (file: File) => {
    setIsLoading(true);
    try {
      const report = await analyzeFileUpload(file);
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

  const handleAnalyzeSample = async (sampleId: string) => {
    setIsLoading(true);
    try {
      const report = await analyzeBenchmarkSample(sampleId);
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
      const report = await analyzeMicrophoneRecording(audioBase64, fileName, isFake);
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
    <div className={`min-h-screen bg-glass-gradient ${currentTheme === 'theme-light' ? 'text-slate-900' : 'text-slate-100'} flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden ${currentTheme}`}>
      {/* Interactive 3D Ambient Particle Background */}
      <ParticleBackground3D />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geminiActive={geminiActive}
        historyCount={historyItems.length}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 relative">
          {/* Ambient 3D Dynamic Floating Light Nodes */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" style={{ animationDelay: '3s' }} />

          {/* Back to Portal Bar when inside a module */}
          {activeTab !== 'home' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Main Portal</span>
              </button>

              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
                {[
                  { id: 'dashboard', label: 'Forensic Inspector', icon: Activity },
                  { id: 'live-mic', label: 'Live Mic', icon: Mic },
                  { id: 'compare', label: 'Dual Inspector', icon: ArrowLeftRight },
                  { id: 'benchmarks', label: 'DFBench', icon: Database },
                  { id: 'history', label: 'History', icon: History, badge: historyItems.length },
                  { id: 'reports', label: 'Reports', icon: FileText },
                  { id: 'docs', label: 'Physics', icon: HelpCircle },
                ].map((mod) => {
                  const Icon = mod.icon;
                  const isActive = activeTab === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveTab(mod.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
                          : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                        title: 'Forensic Inspector',
                        desc: 'Primary 3D acoustic inspection engine for Room Impulse Response (RIR) & human breathing cadence analysis.',
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
                      }
                    ].map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => setActiveTab(mod.id)}
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
                  onOpenExportModal={() => setIsExportModalOpen(true)}
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
    </div>
  );
}
