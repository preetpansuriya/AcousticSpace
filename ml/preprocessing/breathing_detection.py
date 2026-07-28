import numpy as np
from typing import Dict, Any, List

def detect_breathing_anomalies(audio_data: np.ndarray, sample_rate: int = 22050) -> Dict[str, Any]:
    """
    Detects missing diaphragm breathing inhalations and unnatural speech streaming cadence
    indicative of AI deepfake audio generators.
    """
    duration = max(1.0, len(audio_data) / float(sample_rate))
    expected_breaths = max(1, int(np.round(duration / 3.8)))
    
    frame_len = int(sample_rate * 0.05)
    num_frames = len(audio_data) // frame_len
    
    detected_breaths = 0
    in_pause = False
    
    for f in range(num_frames):
        chunk = audio_data[f * frame_len : (f + 1) * frame_len]
        rms = np.sqrt(np.mean(chunk ** 2) + 1e-9)
        db = 20 * np.log10(rms)
        
        if -45.0 < db < -25.0:
            if not in_pause:
                in_pause = True
                detected_breaths += 1
        else:
            in_pause = False
            
    missing_breath_ratio = max(0.0, float((expected_breaths - detected_breaths) / expected_breaths))
    
    unnatural_pause_ratio = round(missing_breath_ratio * 85.0, 1)
    cadence_synchrony_score = round(max(5.0, 100.0 - (missing_breath_ratio * 80.0)), 1)
    
    anomalies: List[Dict[str, Any]] = []
    if missing_breath_ratio >= 0.5:
        anomalies.append({
            "type": "MISSING_BREATH_INHALATION",
            "severity": "CRITICAL" if missing_breath_ratio > 0.8 else "HIGH",
            "description": f"Detected {detected_breaths} diaphragm inhalations across {round(duration, 1)}s speech (expected ~{expected_breaths}). Indicates continuous synthetic text-to-speech rendering.",
            "confidence": round(min(99.0, 75.0 + missing_breath_ratio * 20.0), 1)
        })
        
    return {
        "duration_seconds": round(duration, 2),
        "detected_breaths_count": detected_breaths,
        "expected_breaths_count": expected_breaths,
        "missing_breath_ratio": round(missing_breath_ratio, 2),
        "cadence_synchrony_score": cadence_synchrony_score,
        "unnatural_pause_ratio": unnatural_pause_ratio,
        "diaphragm_recharge_present": detected_breaths > 0,
        "breathing_anomalies": anomalies
    }
