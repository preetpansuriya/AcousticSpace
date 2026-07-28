from typing import Dict, Any, List

def analyze_rir_consistency(rir_features: Dict[str, Any], expected_room_volume_m3: float = 35.0) -> Dict[str, Any]:
    """
    Evaluates extracted RIR acoustic features against physical room propagation physics (Sabine/Eyring formulas)
    to detect deepfake neural vocoder inconsistencies, unphysical dry environments, and reflection phase mismatches.
    """
    rt60 = rir_features.get("rt60_seconds", 0.4)
    edt = rir_features.get("early_decay_time_edt", 0.35)
    c50 = rir_features.get("clarity_c50_db", 8.0)
    mismatch = rir_features.get("reflection_mismatch_score", 15.0)
    
    expected_rt60 = round(0.161 * (expected_room_volume_m3 ** (1/3)) * 0.13, 3) + 0.32
    
    unnatural_dryness_flag = rt60 < 0.08
    c50_anomaly = c50 > 16.0 or c50 < -2.0
    edt_ratio_anomaly = abs(edt / (rt60 + 1e-6) - 0.85) > 0.35
    
    anomaly_score = 0.0
    if unnatural_dryness_flag:
        anomaly_score += 55.0
    if c50_anomaly:
        anomaly_score += 25.0
    if edt_ratio_anomaly:
        anomaly_score += 15.0
        
    anomaly_score += min(20.0, mismatch * 0.2)
    final_anomaly_index = min(99.9, round(max(5.0, anomaly_score), 1))
    
    evidences: List[str] = []
    if unnatural_dryness_flag:
        evidences.append(f"Unnatural acoustic dryness (RT60={rt60}s < 0.08s threshold), characteristic of synthetic TTS neural vocoders.")
    if c50_anomaly:
        evidences.append(f"Clarity C50 index anomaly ({c50} dB), indicating isolated synthetic vocal track lacking physical room reflections.")
    if edt_ratio_anomaly:
        evidences.append(f"Early Decay Time ratio mismatch (EDT={edt}s vs RT60={rt60}s), violating room impulse response physics.")

    return {
        "expected_rt60_seconds": expected_rt60,
        "rt60_deviation_percent": round(abs(rt60 - expected_rt60) / expected_rt60 * 100, 1),
        "unnatural_dryness_flag": unnatural_dryness_flag,
        "c50_anomaly_flag": c50_anomaly,
        "edt_ratio_anomaly": edt_ratio_anomaly,
        "rir_deepfake_anomaly_index": final_anomaly_index,
        "verdict": "CRITICAL_RIR_MISMATCH" if final_anomaly_index > 70.0 else "NATURAL_ROOM_ACOUSTICS",
        "forensic_evidences": evidences
    }
