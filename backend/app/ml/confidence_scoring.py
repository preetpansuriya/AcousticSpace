"""
AcousticSpace - Multi-Vector Confidence Scoring Engine
Combines AST classifier probability, RIR reflection mismatch, and breathing cadence.
"""

from typing import Dict, Any

class ConfidenceScorer:
    @staticmethod
    def calculate_overall_confidence(
        ast_prob: float,
        rir_mismatch: float,
        breathing_cadence: float,
        snr_db: float = 20.0
    ) -> Dict[str, Any]:
        """
        Computes weighted forensic confidence index (0 - 100%).
        """
        ast_weight = 0.40
        rir_weight = 0.35
        breathing_weight = 0.25

        rir_score = rir_mismatch # 0 to 100
        breathing_penalty = 100.0 - breathing_cadence # high penalty if low natural cadence

        weighted_synthetic_score = (
            (ast_prob * 100.0) * ast_weight +
            rir_score * rir_weight +
            breathing_penalty * breathing_weight
        )

        snr_factor = min(1.0, max(0.5, snr_db / 30.0))
        confidence = min(99.9, weighted_synthetic_score * snr_factor)

        return {
            "overall_confidence": round(confidence, 1),
            "verdict": "DEEPFAKE_DETECTED" if weighted_synthetic_score > 50 else "AUTHENTIC_RECORDING",
            "ast_contribution": round((ast_prob * 100.0) * ast_weight, 2),
            "rir_contribution": round(rir_score * rir_weight, 2),
            "breathing_contribution": round(breathing_penalty * breathing_weight, 2)
        }
