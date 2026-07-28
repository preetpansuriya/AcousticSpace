import sys
from pathlib import Path

current_dir = Path(__file__).resolve().parent.parent
if str(current_dir.parent) not in sys.path:
    sys.path.insert(0, str(current_dir.parent))
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
try:
    from app.services.audio_service import analyze_audio_bytes
    from app.database import save_report, get_reports_history
except ModuleNotFoundError:
    from backend.app.services.audio_service import analyze_audio_bytes
    from backend.app.database import save_report, get_reports_history
import datetime

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "AcousticSpace FastAPI Forensic Server",
        "model": "AST + Librosa RIR Pipeline"
    }

@router.post("/analyze")
async def analyze_audio(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    try:
        if file:
            content = await file.read()
            file_name = file.filename or "uploaded.wav"
        else:
            content = b"synthetic_wav_data_placeholder"
            file_name = sample_id or "benchmark_sample.wav"
            
        report = analyze_audio_bytes(content, file_name)
        save_report(
            report["id"],
            file_name,
            report["verdict"],
            report["overall_deepfake_probability"],
            datetime.datetime.utcnow().isoformat(),
            report
        )
        return {"success": True, "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_history():
    return {"history": get_reports_history()}
