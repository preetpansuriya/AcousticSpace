# AcousticSpace 🔊 Deepfake Audio Forensics & RIR Analysis Engine

AcousticSpace is an advanced deepfake audio detection platform using Audio Spectrogram Transformer (AST), Room Impulse Response (RIR) reflection mismatch analysis, and physiological breathing cadence tracking.

## 🌟 Key Features
- **3D Glassmorphic Interface**: Modern animated glassic UI with real-time waveform & spectrogram rendering.
- **AST Transformer Neural Net**: Deep multi-modal speech-synth detection fine-tuned on DFBench Speech25.
- **RIR Wall Reflection Inspector**: Measures RT60 room reverberation decay and wall reflection mismatch.
- **Diaphragm Cadence Detection**: Identifies unnatural speech cadence lacking human inhalation pauses.
- **Forensic Multi-Modal Reports**: Detailed AI evidence breakdown with downloadable PDF report exports.

## 📁 Repository Structure
```
AcousticSpace/
│
├── backend/                  # FastAPI App & Endpoints
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── ml/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env.example
│
├── ml/                       # Machine Learning Pipeline
│   ├── feature_extraction/   # RIR & Spectrogram extraction
│   ├── models/               # PyTorch AST & Fusion Neural Nets
│   ├── preprocessing/        # Audio cleaning & normalizers
│   ├── training/             # Trainer classes
│   └── evaluation/           # Metrics & confusion matrix
│
├── src/                      # React 3D Glassic Frontend
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/           # Interactive 3D glass cards & charts
│   ├── pages/                # Analysis, Benchmark, Compare & Docs
│   └── services/api.ts
│
├── scripts/                  # Data & Training Scripts
│   ├── download_dfbench_speech25.py
│   ├── preprocess_data.py
│   ├── train_ast_model.py
│   └── train_fusion_model.py
│
├── models/                   # Pre-trained Weights & Specs
│   ├── fusion_model.pkl
│   ├── ast_model.pt
│   └── model_card.json
│
├── datasets/                 # Audio Datasets
│   ├── real_vs_fake_audio/
│   └── metadata.csv
│
├── tests/                    # Unit & Integration Tests
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── package.json
└── README.md
```

## 🚀 Quick Start
```bash
# Install frontend dependencies
npm install

# Run full-stack app
npm run dev
```
