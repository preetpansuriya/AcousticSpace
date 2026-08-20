import numpy as np

def normalize_audio_signal(audio_data: np.ndarray, target_peak: float = 0.95) -> np.ndarray:
    """Normalizes audio waveform peak energy and trims leading silence."""
    max_val = np.max(np.abs(audio_data))
    if max_val > 1e-6:
        return (audio_data / max_val) * target_peak
    return audio_data
