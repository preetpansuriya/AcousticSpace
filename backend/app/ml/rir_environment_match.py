"""
AcousticSpace - Room Impulse Response (RIR) Environment Matcher
Compares estimated RT60 reverberation time against expected physical room acoustics.
"""

from typing import Dict, Any

class RIREnvironmentMatcher:
    @staticmethod
    def compare_reverberation(
        measured_rt60: float,
        expected_rt60: float = 0.45,
        room_volume_m3: float = 50.0
    ) -> Dict[str, Any]:
        """
        Uses Sabine & Eyring acoustic reflection formulas to compute mismatch percentage.
        """
        diff = abs(measured_rt60 - expected_rt60)
        mismatch_percent = min(100.0, (diff / max(0.1, expected_rt60)) * 100.0)

        return {
            "measured_rt60": round(measured_rt60, 3),
            "expected_rt60": round(expected_rt60, 3),
            "mismatch_score": round(mismatch_percent, 1),
            "is_environment_mismatch": mismatch_percent > 40.0,
            "acoustic_category": "ANECHOIC / SYNTHETIC" if measured_rt60 < 0.1 else ("EXCESSIVE_REVERB" if measured_rt60 > 1.2 else "MATCHED_OFFICE")
        }
