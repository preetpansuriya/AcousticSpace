import numpy as np

class EnsembleAcousticFusionNet:
    """Ensemble network combining AST transformer logits, RIR decay metrics, and breathing cadence features."""
    
    def __init__(self, weights=(0.5, 0.3, 0.2)):
        self.weights = weights
        
    def fuse(self, ast_prob: float, rir_mismatch: float, breath_score: float) -> float:
        """Combines AST prediction with acoustic physics priors."""
        rir_norm = min(1.0, rir_mismatch / 100.0)
        breath_norm = min(1.0, (100.0 - breath_score) / 100.0)
        
        final_prob = (ast_prob * self.weights[0]) + (rir_norm * self.weights[1] * 100) + (breath_norm * self.weights[2] * 100)
        return float(np.clip(final_prob, 0.0, 100.0))
