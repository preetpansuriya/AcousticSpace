import os

class Settings:
    app_name: str = "AcousticSpace Deepfake Forensics Backend"
    version: str = "2.4.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./acousticspace.db")
    model_path: str = os.getenv("MODEL_PATH", "models/ast_model.pt")
    fusion_model_path: str = os.getenv("FUSION_MODEL_PATH", "models/fusion_model.pkl")

settings = Settings()
