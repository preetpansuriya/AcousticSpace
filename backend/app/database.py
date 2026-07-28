# SQLite / In-Memory Mock ORM for Forensic Reports
import sqlite3
import json
from typing import List, Dict, Any, Optional
try:
    from app.config import settings
except ModuleNotFoundError:
    from backend.app.config import settings

def init_db():
    conn = sqlite3.connect("acousticspace.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            file_name TEXT,
            verdict TEXT,
            deepfake_probability REAL,
            created_at TEXT,
            data_json TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_report(report_id: str, file_name: str, verdict: str, prob: float, created_at: str, report_dict: Dict[str, Any]):
    try:
        conn = sqlite3.connect("acousticspace.db")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO reports (id, file_name, verdict, deepfake_probability, created_at, data_json)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (report_id, file_name, verdict, prob, created_at, json.dumps(report_dict)))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database save warning: {e}")

def get_reports_history() -> List[Dict[str, Any]]:
    try:
        conn = sqlite3.connect("acousticspace.db")
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM reports ORDER BY created_at DESC LIMIT 50")
        rows = cursor.fetchall()
        conn.close()
        return [json.loads(row[0]) for row in rows]
    except Exception as e:
        print(f"Database fetch warning: {e}")
        return []
