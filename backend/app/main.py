import sys
import os
from pathlib import Path

# Add parent directory to sys.path automatically to resolve both 'app' and 'backend.app' imports cleanly
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))
if str(parent_dir.parent) not in sys.path:
    sys.path.insert(0, str(parent_dir.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from app.config import settings
    from app.api.endpoints import router as api_router
    from app.api.analysis import router as analysis_router
    from app.database import init_db
except ModuleNotFoundError:
    from backend.app.config import settings
    from backend.app.api.endpoints import router as api_router
    from backend.app.api.analysis import router as analysis_router
    from backend.app.database import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AcousticSpace - Audio Spectrogram Transformer & RIR Forensic Engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

app.include_router(api_router, prefix="/api")
app.include_router(analysis_router)

@app.get("/")
def root_status():
    return {
        "status": "online",
        "app": settings.app_name,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.host, port=settings.port, reload=True)
