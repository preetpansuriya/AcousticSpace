# AcousticSpace 🔊

## Deepfake Audio Detection & Audio Analysis

AcousticSpace is an AI-based project that analyzes speech audio and helps identify whether a voice recording is **real or AI-generated**.

The project uses **Audio Spectrogram Transformer (AST)**, **Room Impulse Response (RIR)** analysis, and speech-pattern analysis to study different characteristics of an audio recording.

The main goal of this project is to build a practical system that can help detect deepfake audio and provide useful analysis results through a simple web interface.

---

## 🎯 Project Objective

The main objective of AcousticSpace is to detect AI-generated or manipulated speech using machine learning and audio-processing techniques.

Instead of checking only how the voice sounds, the system looks at different audio features such as:

* Spectrogram patterns
* Room acoustic information
* Speech patterns
* Breathing and pause patterns

These features are used together to generate the final analysis result.

---

## 🌟 Key Features

### 🤖 AI-Based Audio Detection

Uses an **Audio Spectrogram Transformer (AST)** model to analyze speech audio and identify patterns that may indicate AI-generated audio.

### 🔊 Spectrogram Analysis

Converts audio into a spectrogram so that its time and frequency patterns can be analyzed.

### 🏠 Room Impulse Response (RIR) Analysis

Checks room-related audio characteristics such as reverberation, echo, and reflection patterns.

This can help identify differences between naturally recorded audio and generated or modified audio.

### 🫁 Speech & Breathing Pattern Analysis

Looks at speech rhythm, pauses, and breathing-related patterns as additional information for the analysis.

### 📊 Combined Analysis

The system uses multiple audio features instead of depending on only one signal or model.

### 📄 Forensic Report

After analysis, the system provides a detailed result and can generate a report containing the available analysis information.

### 🖥️ Interactive Dashboard

Provides a modern web interface where users can:

* Upload audio
* Start analysis
* View prediction results
* Check audio information
* View analysis charts
* Review the generated report

### ⚡ FastAPI Backend

The backend is built with FastAPI and provides APIs for audio analysis, health checks, and other application services.

---

# 🏗️ How the System Works

The overall process is:

```text
User Uploads Audio
        ↓
Audio Validation
        ↓
Audio Preprocessing
        ↓
Feature Extraction
        ↓
Spectrogram Analysis
        ↓
AST Model Analysis
        ↓
RIR Analysis
        ↓
Speech Pattern Analysis
        ↓
Final Prediction
        ↓
Analysis Result
        ↓
Forensic Report
```

---

# 🧠 Machine Learning

AcousticSpace uses an **Audio Spectrogram Transformer (AST)** for audio analysis.

The basic ML process is:

```text
Raw Audio
    ↓
Audio Preprocessing
    ↓
Spectrogram
    ↓
AST Model
    ↓
Feature Extraction
    ↓
Classification
    ↓
Prediction
```

The ML pipeline contains separate parts for:

* Audio preprocessing
* Feature extraction
* Model training
* Model evaluation
* Prediction
* Model management

---

# 📂 Dataset

The project uses **DFBench Speech25** as a dataset source for deepfake speech analysis.

The dataset is used during the development and testing of the audio-analysis pipeline.

### Dataset Workflow

```text
Audio Dataset
      ↓
Data Validation
      ↓
Preprocessing
      ↓
Feature Extraction
      ↓
Training
      ↓
Evaluation
```

Large dataset files should not be uploaded directly to GitHub if they are not suitable for repository storage. The project provides scripts that can be used for dataset preparation.

---

# 📊 Model Evaluation

The model should be evaluated using standard machine learning metrics.

The main metrics include:

* Accuracy
* Precision
* Recall
* F1 Score
* ROC-AUC
* Confusion Matrix

### Results

Add your actual results here after model evaluation.

| Metric    |           Result |
| --------- | ---------------: |
| Accuracy  | Add actual value |
| Precision | Add actual value |
| Recall    | Add actual value |
| F1 Score  | Add actual value |
| ROC-AUC   | Add actual value |

> Only use results obtained from your actual model evaluation.

---

# 🖥️ Application Screenshots

## Dashboard

Add your actual dashboard screenshot:

```md
![AcousticSpace Dashboard](docs/screenshots/dashboard.png)
```

## Audio Analysis

```md
![Audio Analysis](docs/screenshots/analysis.png)
```

## Forensic Report

```md
![Forensic Report](docs/screenshots/forensic-report.png)
```

---

# 📁 Project Structure

```text
AcousticSpace/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── ml/
│   │   └── utils/
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── ml/
│   ├── feature_extraction/
│   ├── models/
│   ├── preprocessing/
│   ├── training/
│   └── evaluation/
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   ├── pages/
│   └── services/
│
├── scripts/
│   ├── download_dfbench_speech25.py
│   ├── preprocess_data.py
│   ├── train_ast_model.py
│   └── train_fusion_model.py
│
├── models/
│   ├── fusion_model.pkl
│   ├── ast_model.pt
│   └── model_card.json
│
├── datasets/
│   ├── real_vs_fake_audio/
│   └── metadata.csv
│
├── tests/
│
├── docs/
│   ├── screenshots/
│   └── project-output.pdf
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── package.json
└── README.md
```

---

# 🛠️ Technologies Used

### Frontend

* React
* TypeScript
* Tailwind CSS
* Interactive charts
* Responsive UI

### Backend

* Python
* FastAPI
* REST API
* Uvicorn

### Machine Learning

* PyTorch
* Hugging Face Transformers
* Audio Spectrogram Transformer
* NumPy
* SciPy
* Librosa

### Tools

* Git
* GitHub
* Docker
* Docker Compose

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/preetpansuriya/AcousticSpace.git
cd AcousticSpace
```

---

## 2. Backend Setup

Create a virtual environment:

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

Install the backend dependencies:

```powershell
cd backend
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
uvicorn app.main:app --reload --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open another terminal and go to the project folder:

```powershell
cd AcousticSpace
npm install
npm run dev
```

The terminal will show the local frontend URL.

Open that URL in your browser to use the application.

> Make sure the commands match the scripts available in your actual `package.json`.

---

# 🔌 API

The FastAPI backend provides APIs for the application.

### Health Check

```http
GET /api/v1/health
```

Used to check whether the backend is running correctly.

### Audio Analysis

```http
POST /api/v1/analyze
```

Used to send an audio file to the backend for analysis.

### API Documentation

FastAPI provides an interactive Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

# 📄 Forensic Report

After the audio analysis is completed, AcousticSpace can generate a report containing the available analysis results.

The report can include:

* Prediction result
* Confidence information
* Audio analysis details
* Spectrogram information
* RIR analysis
* Speech-pattern information
* Overall analysis summary

Project output PDF:

```text
docs/project-output.pdf
```

---

# 🧪 Testing

The project contains a testing folder for unit and integration tests.

Run tests using:

```bash
pytest
```

Make sure all required dependencies are installed before running the tests.

---

# 🔐 Environment Variables

If the project requires environment variables, create a `.env` file from `.env.example`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Add your local configuration to the `.env` file.

**Never upload API keys, passwords, tokens, or other private information to GitHub.**

---

# 🐳 Docker

The project also includes Docker configuration.

Build the application:

```bash
docker compose build
```

Start the containers:

```bash
docker compose up
```

Stop the containers:

```bash
docker compose down
```

---

# 📈 Future Improvements

Some possible improvements for the future are:

* Train the model with larger datasets
* Test the model on different types of audio
* Improve detection of new voice-cloning techniques
* Add real-time audio analysis
* Improve RIR analysis
* Improve breathing and speech-pattern analysis
* Add explainable AI features
* Deploy the system on the cloud
* Improve model speed and memory usage

---

# ⚠️ Limitations

Deepfake audio detection is a challenging problem, and the result can depend on several factors, including:

* Audio quality
* Background noise
* Recording environment
* Audio compression
* Type of AI-generated voice
* Dataset used for training
* Unseen voice-generation methods

Because of these factors, AcousticSpace should be treated as an **analysis tool** and not as absolute proof that an audio recording is real or fake.

---

# 🔒 Security & Privacy

Audio files can contain personal or sensitive information.

For a real-world deployment, the system should use:

* HTTPS
* Secure API access
* File type validation
* Upload size limits
* Secure report storage
* Proper authentication
* Protected environment variables

---

# 👨‍💻 Project Information

**Project Name:** AcousticSpace
**Project Type:** AI / Machine Learning
**Main Focus:** Deepfake Audio Detection
**Frontend:** React + TypeScript
**Backend:** FastAPI
**Machine Learning:** PyTorch + AST
**Dataset:** DFBench Speech25

---

# 🎓 What I Learned

Through this project, I worked with:

* Audio data processing
* Machine learning workflows
* Transformer-based audio models
* Python and PyTorch
* FastAPI backend development
* React frontend development
* API integration
* Git and GitHub
* Docker
* Project testing and documentation

This project helped me understand how an AI model can be connected with a complete web application instead of working only as a standalone ML script.

---

# 🚀 Future Goal

The long-term goal of AcousticSpace is to make the system more accurate, easier to use, and suitable for testing against different types of AI-generated speech.

---

# 📜 License

This project is created for educational, learning, and project demonstration purposes.

If you plan to distribute the project as open source, add an appropriate license such as MIT License.

---

# 🙏 Acknowledgements

This project uses open-source technologies and research resources related to:

* Machine Learning
* Audio Processing
* Speech Analysis
* Transformer Models
* Deepfake Detection

---

# 📌 Disclaimer

AcousticSpace provides automated audio analysis and supporting indicators. The result should not be considered final proof of whether an audio recording is authentic without additional verification.
