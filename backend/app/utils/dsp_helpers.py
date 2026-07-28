import numpy as np

def compute_rt60_reverberation(audio_data: np.ndarray, sample_rate: int = 22050) -> float:
    """Computes Schroeder integration RT60 room reverberation decay time."""
    if len(audio_data) < 100:
        return 0.45
    energy = audio_data ** 2
    schroeder = np.flip(np.cumsum(np.flip(energy)))
    schroeder_db = 10 * np.log10(schroeder + 1e-10)
    schroeder_db -= np.max(schroeder_db)
    
    # Estimate slope between -5dB and -25dB (T20 * 3)
    idx_5 = np.where(schroeder_db <= -5.0)[0]
    idx_25 = np.where(schroeder_db <= -25.0)[0]
    
    if len(idx_5) > 0 and len(idx_25) > 0 and idx_25[0] > idx_5[0]:
        t_diff = (idx_25[0] - idx_5[0]) / float(sample_rate)
        rt60 = t_diff * 3.0
        return float(np.clip(rt60, 0.01, 2.5))
    return 0.42

def compute_spectral_centroid(audio_data: np.ndarray, sample_rate: int = 22050) -> float:
    """Computes overall spectral centroid in Hz."""
    fft_vals = np.abs(np.fft.rfft(audio_data))
    freqs = np.fft.rfftfreq(len(audio_data), 1.0 / sample_rate)
    sum_fft = np.sum(fft_vals)
    if sum_fft < 1e-6:
        return 2200.0
    centroid = np.sum(freqs * fft_vals) / sum_fft
    return float(centroid)
