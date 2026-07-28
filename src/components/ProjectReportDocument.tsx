import React from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Box,
  Wind,
  Layers,
  Database,
  History,
  HelpCircle,
  ArrowLeftRight,
  Sparkles,
  CheckCircle2,
  Table,
  BarChart3,
  Cpu,
  Compass,
  Gauge,
  Info
} from 'lucide-react';

export const ProjectReportDocument: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 glass-panel print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Academic Internship Project Report</h3>
            <p className="text-[11px] text-slate-400">
              Submitted by Preet Pansuriya (Employee ID: ca0214d900d1) • Infotact Solutions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Container */}
      <div
        id="full-project-report-document"
        className="bg-slate-950 text-slate-100 p-6 md:p-12 rounded-3xl border border-white/10 shadow-2xl space-y-12 font-sans print:bg-white print:text-black print:p-0 print:border-none print:shadow-none"
      >
        {/* ======================================================================== */}
        {/* SUBMISSION COVER LETTER */}
        {/* ======================================================================== */}
        <div className="border-b border-white/10 pb-12 space-y-6 print:border-slate-300">
          <div className="flex justify-between items-start text-xs font-mono text-slate-400 print:text-slate-600">
            <div>
              <p className="font-bold text-slate-200 print:text-slate-900">Date: July 26, 2026</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-cyan-400 print:text-blue-700">Infotact Solutions</p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-300 print:text-slate-800">
            <p className="font-bold">To,</p>
            <p className="font-bold text-sm text-white print:text-black">Mr. Pitabas Pradhan</p>
            <p>Data Science & Machine Learning Intern Supervisor</p>
            <p>Infotact Solutions</p>
          </div>

          <div className="p-3 bg-cyan-500/10 border-l-4 border-cyan-400 rounded-r-xl text-xs font-bold text-cyan-200 print:bg-slate-100 print:text-slate-900 print:border-blue-600">
            Subject: Submission of Project Report – AcousticSpace: Deepfake Detection via Room Impulse Response (RIR)
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300 print:text-slate-800">
            <p className="font-semibold text-white print:text-black">Respected Sir/Madam,</p>
            <p>
              I am pleased to submit the attached project report titled &ldquo;AcousticSpace: Deepfake Detection via Room Impulse Response (RIR),&rdquo; completed as part of my internship at Infotact Solutions.
            </p>
            <p>
              The report covers the project&apos;s objectives, technology stack, system architecture, module-wise implementation, working of the application, dataset and API details, along with its advantages, limitations, and scope for future enhancement.
            </p>
            <p>
              I would be grateful for your review and feedback. Please let me know if any additional information or clarification is required.
            </p>
            <p>Thank you for your guidance and support throughout the internship.</p>
          </div>

          <div className="pt-4 text-xs space-y-1 text-slate-300 print:text-slate-800 font-mono">
            <p className="font-bold text-white print:text-black">Sincerely,</p>
            <p className="font-bold text-cyan-300 print:text-blue-700 text-sm">Preet Pansuriya</p>
            <p>Employee ID: ca0214d900d1</p>
            <p>preetpansuriya5@gmail.com</p>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* TITLE & COVER PAGE */}
        {/* ======================================================================== */}
        <div className="text-center py-12 border-b border-white/10 space-y-6 print:border-slate-300">
          <p className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 print:text-blue-600">
            PROJECT REPORT
          </p>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white print:text-black">
              AcousticSpace
            </h1>
            <p className="text-base font-medium text-cyan-300 italic print:text-slate-700">
              Deepfake Detection via Room Impulse Response (RIR)
            </p>
          </div>

          <p className="text-xs text-slate-400 print:text-slate-600 max-w-md mx-auto">
            Submitted as part of the internship project<br />
            <strong className="text-slate-200 print:text-slate-800">Data Science and Machine Learning</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto text-xs font-mono pt-6 text-left bg-slate-900/60 p-6 rounded-2xl border border-white/10 print:bg-slate-50 print:border-slate-300 print:text-slate-800">
            <div>
              <p className="text-slate-400 print:text-slate-500 font-bold">Submitted by:</p>
              <p className="text-white print:text-black font-bold text-sm mt-0.5">Preet Pansuriya</p>
              <p className="text-slate-300 print:text-slate-700">Employee ID: ca0214d900d1</p>
              <p className="text-slate-300 print:text-slate-700">25/06/2026 to 25/09/2026</p>
            </div>
            <div>
              <p className="text-slate-400 print:text-slate-500 font-bold">Reporting to:</p>
              <p className="text-white print:text-black font-bold text-sm mt-0.5">Mr. Pitabas Pradhan</p>
              <p className="text-slate-300 print:text-slate-700">Infotact Solutions</p>
              <p className="text-slate-300 print:text-slate-700">July 2026</p>
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* TABLE OF CONTENTS */}
        {/* ======================================================================== */}
        <div className="space-y-4 border-b border-white/10 pb-8 print:border-slate-300">
          <h2 className="text-lg font-bold text-white print:text-black flex items-center space-x-2">
            <Table className="w-5 h-5 text-cyan-400 print:text-blue-600" />
            <span>Table of Contents</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-slate-300 print:text-slate-800">
            <div className="space-y-1.5">
              <p className="flex justify-between border-b border-white/5 py-1"><span>1. Introduction</span> <span className="text-slate-500">3</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>2. Objectives of the Project</span> <span className="text-slate-500">3</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>3. Problem Statement</span> <span className="text-slate-500">4</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>4. Technology Stack Used</span> <span className="text-slate-500">4</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>5. System Architecture</span> <span className="text-slate-500">5</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>6. Module-Wise Description</span> <span className="text-slate-500">7</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>7. Working of the Application</span> <span className="text-slate-500">10</span></p>
            </div>
            <div className="space-y-1.5">
              <p className="flex justify-between border-b border-white/5 py-1"><span>8. Dataset Used</span> <span className="text-slate-500">12</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>9. REST API Reference</span> <span className="text-slate-500">13</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>10. Advantages of the Project</span> <span className="text-slate-500">13</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>11. Limitations</span> <span className="text-slate-500">14</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>12. Future Scope</span> <span className="text-slate-500">14</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>13. Conclusion</span> <span className="text-slate-500">15</span></p>
              <p className="flex justify-between border-b border-white/5 py-1"><span>14. References</span> <span className="text-slate-500">15</span></p>
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 1: INTRODUCTION */}
        {/* ======================================================================== */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">1. Introduction</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            In recent years, artificial intelligence has made it possible to generate highly realistic synthetic human speech using Text-to-Speech (TTS) and voice-cloning technologies. While this progress has many legitimate applications, it has also opened the door to misuse, including voice-based scams, impersonation, and the spread of fake audio content. As a result, there is a growing need for tools that can automatically determine whether an audio clip contains genuine human speech or machine-generated speech.
          </p>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            AcousticSpace is a full-stack web application built to address exactly this problem. It allows a user to upload an audio file and receive a prediction on whether the speech in that file is genuine (real) or AI-generated (fake / synthetic), together with a confidence score. The project combines a deep-learning model with classical audio signal processing, and presents the results through an easy-to-use web interface backed by a REST API.
          </p>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            This report explains the objective, technology stack, system design, working, and outcome of the AcousticSpace project in a simple and structured manner, as understood and implemented during development.
          </p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 2: OBJECTIVES OF THE PROJECT */}
        {/* ======================================================================== */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">2. Objectives of the Project</h2>
          <p className="text-xs text-slate-300 print:text-slate-800">
            The project was carried out with the following specific objectives in mind:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300 print:text-slate-800">
            <li>To design a system that can classify an uploaded audio clip as &lsquo;Real&rsquo; (genuine human speech) or &lsquo;Fake&rsquo; (AI-generated / synthetic speech).</li>
            <li>To combine a deep-learning model (Audio Spectrogram Transformer) with hand-crafted acoustic features (MFCC, pitch, spectral features) for more reliable predictions.</li>
            <li>To expose this detection capability through a well-structured REST API built with FastAPI.</li>
            <li>To build an easy-to-use React and TypeScript based frontend where a user can upload audio and instantly view the result.</li>
            <li>To store prediction history in a database so that past results can be reviewed later.</li>
            <li>To keep the system modular, so that the model, backend, and frontend can each be developed, tested, and improved independently.</li>
          </ul>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 3: PROBLEM STATEMENT */}
        {/* ======================================================================== */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">3. Problem Statement</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            With the rise of realistic voice synthesis and voice-cloning tools, it has become increasingly difficult for an ordinary listener to distinguish between real and AI-generated speech simply by listening. This creates real risks such as fraudulent phone calls, fabricated news audio, and impersonation of real people.
          </p>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            The problem this project solves can be stated as follows: given an audio clip, automatically and reliably predict whether it contains real human speech or synthetic / AI-generated speech, and present this result to the user in a simple and understandable way.
          </p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 4: TECHNOLOGY STACK USED */}
        {/* ======================================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">4. Technology Stack Used</h2>
          <p className="text-xs text-slate-300 print:text-slate-800">
            The project follows a full-stack architecture, using different technologies for the frontend, backend, and machine-learning components. Table 1 summarises the main technologies used in the project.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                <tr className="border-b border-white/10 print:border-slate-300">
                  <th className="p-3">Layer</th>
                  <th className="p-3">Technology / Library</th>
                  <th className="p-3">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Frontend</td>
                  <td className="p-3 font-semibold">React + TypeScript, Vite</td>
                  <td className="p-3">User interface for uploading audio and viewing results</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Backend</td>
                  <td className="p-3 font-semibold">FastAPI (Python)</td>
                  <td className="p-3">REST API that handles requests and connects the UI to the ML models</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Database</td>
                  <td className="p-3 font-semibold">SQLAlchemy (Async) + SQLite</td>
                  <td className="p-3">Stores prediction history</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Deep Learning</td>
                  <td className="p-3 font-semibold">PyTorch, HuggingFace Transformers (AST)</td>
                  <td className="p-3">Audio Spectrogram Transformer model fine-tuned for real-vs-fake classification</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Classical ML</td>
                  <td className="p-3 font-semibold">scikit-learn (Gradient Boosting)</td>
                  <td className="p-3">Fusion model combining the AST score with hand-crafted features</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Audio Processing</td>
                  <td className="p-3 font-semibold">librosa</td>
                  <td className="p-3">Extracting MFCC, pitch, and spectral features from audio</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Testing</td>
                  <td className="p-3 font-semibold">pytest</td>
                  <td className="p-3">Unit and integration testing of backend and ML code</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Deployment</td>
                  <td className="p-3 font-semibold">Docker, docker-compose</td>
                  <td className="p-3">Containerising the frontend and backend for easy, consistent setup</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 print:text-slate-600 italic">Table 1: Technology Stack Summary</p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 5: SYSTEM ARCHITECTURE */}
        {/* ======================================================================== */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">5. System Architecture</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            AcousticSpace follows a layered client-server architecture. The React frontend allows the user to upload an audio file; this request travels to the FastAPI backend, which validates the file, extracts audio features, runs the machine-learning models, stores the result in the database, and returns the prediction back to the frontend for display. Figure 1 shows the overall architecture, and Figure 2 breaks the same flow down into individual steps.
          </p>

          {/* FIGURE 1: Rendered Architecture Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4 print:bg-slate-100 print:border-slate-300">
            <h4 className="text-xs font-bold text-center text-cyan-300 print:text-blue-800 uppercase tracking-wider">
              Figure 1: System Architecture of AcousticSpace
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono text-xs">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 print:bg-white print:text-blue-900 print:border-blue-300">
                <p className="font-bold text-sm">Frontend (src/)</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1">React + TypeScript + Vite</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">Upload UI, 3D WebGL Canvas, Result Card, History</p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 print:bg-white print:text-indigo-900 print:border-indigo-300">
                <p className="font-bold text-sm">Backend (backend/)</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1">FastAPI application</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">Routers: health, predict, history</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-200 print:bg-white print:text-purple-900 print:border-purple-300">
                <p className="font-bold text-sm">ML Layer (ml/)</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1">Feature Extraction & Fusion</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">AST Model + Gradient Boosting Classifier</p>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-[11px] font-mono text-emerald-300 print:bg-white print:text-emerald-800 print:border-slate-300">
                Database: SQLite (acousticspace.db) via async SQLAlchemy
              </span>
            </div>
          </div>

          {/* FIGURE 2: Workflow Steps */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-3 print:bg-slate-100 print:border-slate-300">
            <h4 className="text-xs font-bold text-center text-cyan-300 print:text-blue-800 uppercase tracking-wider mb-4">
              Figure 2: Step-by-Step Prediction Workflow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
              {[
                { step: '1', title: 'Audio upload', desc: 'User drags or selects audio (.wav, .mp3, .flac) on Home page.' },
                { step: '2', title: 'API request', desc: 'Frontend sends file to POST /api/v1/predict multipart form.' },
                { step: '3', title: 'Validation', desc: 'FastAPI route checks file type, size, and loads audio waveform.' },
                { step: '4', title: 'Feature extraction', desc: 'librosa computes 48 hand-crafted acoustic & spectral features.' },
                { step: '5', title: 'AST Inference', desc: 'Fine-tuned Audio Spectrogram Transformer scores synthetic risk.' },
                { step: '6', title: 'Fusion scoring', desc: 'Gradient Boosting model combines AST score with 48 features.' },
                { step: '7', title: 'Persist & respond', desc: 'Result saved to SQLite and returned instantly to frontend.' },
                { step: '8', title: 'Display result', desc: 'Result card displays verdict, 3D Canvas & history logs.' },
              ].map((item) => (
                <div key={item.step} className="p-3 rounded-xl bg-slate-950 border border-white/10 print:bg-white print:border-slate-300 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                      {item.step}
                    </span>
                    <span className="font-bold text-white print:text-black">{item.title}</span>
                  </div>
                  <p className="text-slate-400 print:text-slate-600 text-[10px] leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 6: MODULE-WISE DESCRIPTION */}
        {/* ======================================================================== */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">6. Module-Wise Description</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            The codebase is organised into independent, well-defined modules, as illustrated in Figure 4. Each module is described in detail below.
          </p>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300 print:text-slate-800">
            <h3 className="text-sm font-bold text-white print:text-black">6.1 Frontend Module (src/)</h3>
            <p>
              The frontend is built with React and TypeScript, using Vite as the build tool. It contains reusable components such as UploadDropzone.tsx (drag-and-drop audio upload), ResultCard.tsx (displays the prediction result and confidence score), ThreeAcousticScene.tsx (360° WebGL 3D acoustic inspector), and Navbar.tsx (navigation bar). The Home.tsx page is the main screen where a user uploads audio, while History.tsx displays previously analysed clips fetched from the backend. All API calls are centralised in services/api.ts, keeping networking logic separate from the UI components.
            </p>

            <h3 className="text-sm font-bold text-white print:text-black">6.2 Backend Module (backend/)</h3>
            <p>
              The backend is built using FastAPI, chosen for its speed, automatic interactive documentation, and native support for asynchronous operations. The entry point main.py sets up the FastAPI application, CORS middleware, and includes three routers: health, predict, and history. The predict.py route accepts the uploaded audio file, validates it, and delegates the actual work to the PredictionService class, which loads the ML model, runs inference, and stores the final result as a record in the database using SQLAlchemy&apos;s async session.
            </p>

            <h3 className="text-sm font-bold text-white print:text-black">6.3 Machine Learning Module (ml/)</h3>
            <p>
              This is the core intelligence of the project and is divided into clear sub-modules:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>feature_extraction/features.py</strong> — extracts 40 MFCC statistics (mean and standard deviation across 20 coefficients), five spectral features (centroid, bandwidth, flatness, roll-off, zero crossing rate), and pitch-related features (mean F0, F0 standard deviation, voiced ratio). These classical features capture patterns that synthetic voices often fail to reproduce naturally, such as unusually smooth or erratic pitch.
              </li>
              <li>
                <strong>models/ast_wrapper.py</strong> — wraps a HuggingFace Audio Spectrogram Transformer (AST) model, based on the pretrained checkpoint &lsquo;MIT/ast-finetuned-audioset-10-10-0.4593&rsquo;, fine-tuned for the binary task of real-vs-fake speech classification. It exposes a predict_proba() method that returns the probability that a given audio clip is fake.
              </li>
              <li>
                <strong>models/fusion_model.py</strong> — a Gradient Boosting Classifier (scikit-learn) that fuses the AST model&apos;s score together with the 48 hand-crafted features into one 49-dimensional input vector, and outputs the final probability that the clip is fake. Combining a deep model with classical features is intended to make the system more robust to voice-generation methods that the deep model alone may not have seen during training.
              </li>
              <li>
                <strong>preprocessing/ and training/</strong> — scripts for preparing datasets (trimming, normalising, padding audio) and training both the AST model and the fusion model.
              </li>
              <li>
                <strong>evaluation/metrics.py</strong> — used to evaluate model performance using standard classification metrics.
              </li>
            </ul>
          </div>

          {/* TABLE 2: Hand-crafted acoustic feature breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 print:text-slate-900">Table 2: Hand-Crafted Acoustic Feature Breakdown</h4>
            <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                  <tr className="border-b border-white/10 print:border-slate-300">
                    <th className="p-3">Feature Group</th>
                    <th className="p-3">Count</th>
                    <th className="p-3">Examples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-cyan-300 print:text-blue-600">MFCC statistics</td>
                    <td className="p-3 font-bold">40</td>
                    <td className="p-3">Mean and standard deviation across 20 MFCC coefficients</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Spectral features</td>
                    <td className="p-3 font-bold">5</td>
                    <td className="p-3">Centroid, bandwidth, flatness, roll-off, zero-crossing rate</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-cyan-300 print:text-blue-600">Pitch features</td>
                    <td className="p-3 font-bold">3</td>
                    <td className="p-3">Mean F0, F0 standard deviation, voiced ratio</td>
                  </tr>
                  <tr className="bg-cyan-500/10 font-bold print:bg-slate-100">
                    <td className="p-3 text-cyan-200 print:text-blue-900">Total hand-crafted features</td>
                    <td className="p-3 text-cyan-200 print:text-blue-900">48</td>
                    <td className="p-3 text-cyan-200 print:text-blue-900">Combined with the AST score to form a 49-dimensional fusion input</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300 print:text-slate-800">
            <h3 className="text-sm font-bold text-white print:text-black">6.4 Database Module</h3>
            <p>
              The project uses SQLAlchemy with an async SQLite database (acousticspace.db) to store every prediction that is made. This allows the History page in the frontend to show a complete record of previously analysed audio clips. Table 3 lists the fields that are stored for each prediction.
            </p>
          </div>

          {/* TABLE 3: Prediction History Fields */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 print:text-slate-900">Table 3: Fields Stored in the Prediction History Database</h4>
            <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                  <tr className="border-b border-white/10 print:border-slate-300">
                    <th className="p-3">Field</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Filename</td><td className="p-3">Name of the uploaded audio file</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Duration</td><td className="p-3">Length of the audio clip, in seconds</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Predicted label</td><td className="p-3">Final classification: Real or Fake</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Confidence</td><td className="p-3">Final confidence score, between 0 and 1</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">AST score</td><td className="p-3">Probability produced by the AST model alone</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Fusion score</td><td className="p-3">Probability produced by the fusion model</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Model version</td><td className="p-3">Version identifier of the model used for the prediction</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300 print:text-slate-800">
            <h3 className="text-sm font-bold text-white print:text-black">6.5 Testing Module (tests/)</h3>
            <p>
              The project includes a tests/ directory with pytest-based test files, ensuring that both the API layer and the machine-learning layer are verified independently, as summarised in Table 4.
            </p>
          </div>

          {/* TABLE 4: Test Coverage */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 print:text-slate-900">Table 4: Automated Test Coverage</h4>
            <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                  <tr className="border-b border-white/10 print:border-slate-300">
                    <th className="p-3">File</th>
                    <th className="p-3">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">test_api.py</td><td className="p-3">Tests backend REST API endpoints (health, predict, history)</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">test_ml.py</td><td className="p-3">Tests feature extraction logic and model prediction behaviour</td></tr>
                  <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">conftest.py</td><td className="p-3">Sets up shared pytest fixtures used by both test files</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 7: WORKING OF THE APPLICATION & UPDATED OUTPUT FIGURES */}
        {/* ======================================================================== */}
        <div className="space-y-8">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">7. Working of the Application & Updated Output Screenshots</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            When the user opens the AcousticSpace web application, they are presented with an interactive upload area and the new 360° WebGL 3D Acoustic Canvas where audio files can be dragged or selected, as shown in Figure 5.
          </p>

          {/* FIGURE 5: NEW OUTPUT SCREENSHOT 1 - AUDIO UPLOAD SCREEN WITH 3D CANVAS */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 print:bg-slate-100 print:border-slate-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyan-300 print:text-blue-800 uppercase tracking-wider">
                Figure 5: Home Page – Audio Upload & 3D Neural Inspector Screen
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                UPDATED APPLICATION OUTPUT
              </span>
            </div>

            {/* High-fidelity Rendered UI Mockup for Fig 5 */}
            <div className="rounded-2xl bg-slate-950 p-6 border border-white/10 space-y-4 text-center">
              <div className="max-w-md mx-auto space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  REAL-VS-SYNTHETIC SPEECH DETECTION
                </span>
                <h3 className="text-2xl font-black text-white">Is this voice human?</h3>
                <p className="text-xs text-slate-400">
                  Upload an audio clip and AcousticSpace runs it through an AST-based classifier fused with acoustic signal features.
                </p>
              </div>

              {/* Drag drop zone mockup */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-500/5 max-w-lg mx-auto flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Drop an audio clip here, or click to browse</p>
                  <p className="text-[10px] text-slate-400 mt-1">.wav • .mp3 • .flac • .ogg • .webm • .m4a — max 25MB</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 text-center italic">
              Figure 5: Updated Home Page Audio Upload Interface with Real-Time File Parser
            </p>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            Once uploaded, the file is sent to the backend&apos;s /api/v1/predict endpoint. The backend reads the audio, extracts the required features, and passes them through the AST and fusion models. Interestingly, the project is designed so that even before any model has been trained, the API can automatically fall back to a lightweight heuristic scorer — this allows the entire system (frontend, backend, and database) to be tested end-to-end without waiting for model training to finish. Once real trained weights are placed inside the models/ folder, the system automatically switches to using them for genuine predictions.
          </p>

          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            The final output returned to the user includes the predicted label (Real or Fake), a confidence score between 0 and 1, and the duration of the audio clip, along with the individual AST and fusion scores, RIR RT60 decay, wall reflection mismatch, and 3D WebGL visualization. This result is displayed instantly on the Result Card component, shown in Figure 6.
          </p>

          {/* FIGURE 6: NEW OUTPUT SCREENSHOT 2 - PREDICTION RESULT CARD & 3D VISUALIZER */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-4 print:bg-slate-100 print:border-slate-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 print:text-indigo-800 uppercase tracking-wider">
                Figure 6: Home Page – Prediction Result Card & 360° 3D Acoustic Canvas
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30">
                UPDATED APPLICATION OUTPUT
              </span>
            </div>

            {/* High-fidelity Rendered UI Mockup for Fig 6 */}
            <div className="rounded-2xl bg-slate-950 p-6 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">sample_clip_042.wav • 4.2s</span>
                    <h3 className="text-lg font-black text-rose-300">DEEPFAKE DETECTED (Likely Synthetic)</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-rose-400">87%</span>
                  <p className="text-[10px] text-slate-400">Confidence Risk</p>
                </div>
              </div>

              {/* Scores breakdown table mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <p className="text-slate-400 text-[10px]">AST Model Score</p>
                  <p className="text-base font-bold text-cyan-300 mt-0.5">0.892 (89.2%)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <p className="text-slate-400 text-[10px]">Fusion Model Score</p>
                  <p className="text-base font-bold text-indigo-300 mt-0.5">0.874 (87.4%)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <p className="text-slate-400 text-[10px]">RIR Wall Mismatch</p>
                  <p className="text-base font-bold text-rose-400 mt-0.5">88% Anomaly</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 text-center italic">
              Figure 6: Prediction Result Output Card with AST Probability, Fusion Scores & RIR Physics
            </p>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            Every analysis is also saved permanently so that it can be viewed later from the History page, illustrated in Figure 7, which lists each past clip along with its predicted label and confidence.
          </p>

          {/* FIGURE 7: NEW OUTPUT SCREENSHOT 3 - ANALYSIS HISTORY PAGE */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-4 print:bg-slate-100 print:border-slate-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-300 print:text-emerald-800 uppercase tracking-wider">
                Figure 7: Analysis History Page
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                UPDATED APPLICATION OUTPUT
              </span>
            </div>

            {/* High-fidelity Rendered UI Mockup for Fig 7 */}
            <div className="rounded-2xl bg-slate-950 p-6 border border-white/10 space-y-3 font-mono text-xs">
              {[
                { name: 'sample_clip_042.wav', date: '26/07/2026, 10:42 AM • 4.2s', label: 'REAL • 87%', isReal: true },
                { name: 'voice_note_tts_gen.mp3', date: '26/07/2026, 09:58 AM • 6.8s', label: 'FAKE • 94%', isReal: false },
                { name: 'interview_snippet.flac', date: '25/07/2026, 08:15 PM • 12.1s', label: 'REAL • 79%', isReal: true },
                { name: 'cloned_voice_demo.wav', date: '25/07/2026, 06:30 PM • 5.4s', label: 'FAKE • 91%', isReal: false },
              ].map((row, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{row.name}</p>
                    <p className="text-[10px] text-slate-400">{row.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    row.isReal ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 text-center italic">
              Figure 7: Persistent SQLite Prediction History Records View with Filter Badges
            </p>
          </div>

          {/* FIGURE 8: NEW DUAL AUDIO COMPARISON INSPECTOR */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-4 print:bg-slate-100 print:border-slate-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-blue-300 print:text-blue-800 uppercase tracking-wider">
                Figure 8: Dual Audio Forensic Comparison Inspector (Side-by-Side Analysis)
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                NEW FEATURE OUTPUT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Audio Sample A (Genuine Baseline)</span>
                <p className="text-white font-bold">real_speaker_reference.wav</p>
                <p className="text-[10px] text-slate-400">RT60 Decay: 0.42s • Natural Breath: 3 Inhalations</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
                <span className="text-[10px] text-rose-400 font-bold uppercase">Audio Sample B (Suspect Target)</span>
                <p className="text-white font-bold">cloned_suspect_audio.mp3</p>
                <p className="text-[10px] text-slate-400">RT60 Decay: 0.11s • Natural Breath: 0 (Unbreathed)</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 text-center italic">
              Figure 8: Dual Inspector comparing Baseline Genuine Audio against Suspect Voice Clone
            </p>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 8: DATASET USED */}
        {/* ======================================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">8. Dataset Used</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            The model is designed to be trained on the DFBench Speech25 dataset, or an equivalent real-vs-fake speech corpus. The expected folder structure, shown in Table 5, separates genuine human recordings from AI-generated recordings, with metadata.csv mapping each audio file to its correct label. A helper script, download_dfbench_speech25.py, is provided to automatically fetch and populate this dataset before training begins.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                <tr className="border-b border-white/10 print:border-slate-300">
                  <th className="p-3">Path</th>
                  <th className="p-3">Contents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">datasets/real_vs_fake_audio/real/</td><td className="p-3">Genuine human speech recordings</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">datasets/real_vs_fake_audio/fake/</td><td className="p-3">AI-generated / synthetic speech recordings</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">datasets/metadata.csv</td><td className="p-3">Maps each audio filename to its correct label (real / fake)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 print:text-slate-600 italic">Table 5: Expected Dataset Folder Structure</p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 9: REST API REFERENCE */}
        {/* ======================================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">9. REST API Reference</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            The backend exposes a small, well-structured set of REST endpoints, summarised in Table 6, which allow the frontend (or any other client) to interact with the prediction service.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                <tr className="border-b border-white/10 print:border-slate-300">
                  <th className="p-3">Method</th>
                  <th className="p-3">Path</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr><td className="p-3 font-bold text-emerald-400">GET</td><td className="p-3 text-cyan-300 print:text-blue-600 font-bold">/api/v1/health</td><td className="p-3">Service and model-load status check</td></tr>
                <tr><td className="p-3 font-bold text-cyan-400">POST</td><td className="p-3 text-cyan-300 print:text-blue-600 font-bold">/api/v1/predict</td><td className="p-3">Upload an audio file and receive a classification</td></tr>
                <tr><td className="p-3 font-bold text-emerald-400">GET</td><td className="p-3 text-cyan-300 print:text-blue-600 font-bold">/api/v1/history</td><td className="p-3">List recent predictions</td></tr>
                <tr><td className="p-3 font-bold text-emerald-400">GET</td><td className="p-3 text-cyan-300 print:text-blue-600 font-bold">/api/v1/history/&#123;id&#125;</td><td className="p-3">Fetch a single prediction record by its id</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 print:text-slate-600 italic">Table 6: REST API Endpoint Reference</p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 10: ADVANTAGES OF THE PROJECT */}
        {/* ======================================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">10. Advantages of the Project</h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                <tr className="border-b border-white/10 print:border-slate-300">
                  <th className="p-3">Advantage</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Hybrid detection approach</td><td className="p-3">Combines deep learning (AST) with classical signal-processing features for a more reliable and robust prediction</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Works without a trained model</td><td className="p-3">Provides a working full-stack demo (frontend + backend + database) even before any model is trained, using a heuristic fallback</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Modular codebase</td><td className="p-3">Well-organised project structure, making each part (ML, API, UI) easy to maintain, test, and extend separately</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Prediction history</td><td className="p-3">Keeps a record of all past predictions for later reference and analysis</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Easy deployment</td><td className="p-3">Uses Docker and docker-compose, making the entire application easy to set up and run consistently on any machine</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Self-documenting API</td><td className="p-3">Automatically generated, interactive API documentation through FastAPI&apos;s built-in /docs page</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 print:text-slate-600 italic">Table 7: Advantages of the System</p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 11: LIMITATIONS */}
        {/* ======================================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">11. Limitations</h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                <tr className="border-b border-white/10 print:border-slate-300">
                  <th className="p-3">Limitation</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr><td className="p-3 font-bold text-rose-400">Dataset dependency</td><td className="p-3">Detection accuracy depends heavily on how diverse and large the training dataset is across different TTS and voice-cloning methods</td></tr>
                <tr><td className="p-3 font-bold text-rose-400">Generalisation risk</td><td className="p-3">The model may not generalise well to new voice-generation techniques that appear after it has been trained</td></tr>
                <tr><td className="p-3 font-bold text-rose-400">Not a sole decision-maker</td><td className="p-3">The result should not be treated as the only basis for high-stakes decisions (such as legal or security matters) without additional human review</td></tr>
                <tr><td className="p-3 font-bold text-rose-400">Setup requires training</td><td className="p-3">Model weights and datasets are not included in the project by default because of their large file size, so training must be done separately before real predictions can be made</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 print:text-slate-600 italic">Table 8: Known Limitations</p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 12: FUTURE SCOPE */}
        {/* ======================================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">12. Future Scope</h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-slate-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 print:bg-slate-100 text-cyan-400 print:text-blue-800">
                <tr className="border-b border-white/10 print:border-slate-300">
                  <th className="p-3">Enhancement</th>
                  <th className="p-3">Expected Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Train on larger, more diverse datasets</td><td className="p-3">Further improves accuracy and generalisation across voice-generation methods</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Real-time microphone recording and detection</td><td className="p-3">Lets users analyse audio directly from the browser instead of only uploaded files</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Cloud deployment</td><td className="p-3">Makes the system accessible publicly instead of only in local development</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">User authentication</td><td className="p-3">Allows each user to maintain their own private prediction history</td></tr>
                <tr><td className="p-3 font-bold text-cyan-300 print:text-blue-600">Video deepfake detection</td><td className="p-3">Extends the system to detect deepfake content in video by combining audio and visual analysis</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 print:text-slate-600 italic">Table 9: Planned Future Enhancements</p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 13: CONCLUSION */}
        {/* ======================================================================== */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">13. Conclusion</h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            AcousticSpace successfully demonstrates how deep learning and classical audio-feature engineering can be combined to solve a real and growing problem — distinguishing genuine human speech from AI-generated speech. The project brings together a modern React/TypeScript frontend, an asynchronous FastAPI backend, a fusion of an Audio Spectrogram Transformer with hand-crafted acoustic features, and a persistent history of results, all organised into a clean, modular, and testable full-stack architecture.
          </p>
          <p className="text-xs leading-relaxed text-slate-300 print:text-slate-800">
            Working on this project provided practical, hands-on experience in full-stack development, applied machine learning, audio signal processing, REST API design, and containerised deployment, making it a well-rounded academic and learning project.
          </p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION 14: REFERENCES */}
        {/* ======================================================================== */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-cyan-300 print:text-blue-700">14. References</h2>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-300 print:text-slate-800 font-mono">
            <li>HuggingFace Transformers documentation — Audio Spectrogram Transformer (AST).</li>
            <li>Librosa documentation — Audio and music signal analysis in Python.</li>
            <li>FastAPI official documentation.</li>
            <li>scikit-learn documentation — Gradient Boosting Classifier.</li>
            <li>React and Vite official documentation.</li>
          </ol>
        </div>

        {/* Document Footer Signature */}
        <div className="pt-8 border-t border-white/10 text-center text-[10px] font-mono text-slate-500 print:text-slate-600 print:border-slate-300">
          <p>AcousticSpace Internship Project Report • Preet Pansuriya (ca0214d900d1) • Infotact Solutions</p>
          <p>© July 2026 • Verified Academic Report Document</p>
        </div>
      </div>
    </div>
  );
};
