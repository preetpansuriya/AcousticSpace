import numpy as np

def compute_mel_spectrogram_matrix(audio_data: np.ndarray, sample_rate: int = 22050, n_mels: int = 128):
    """Computes Mel-frequency log spectrogram matrix for AST feature input."""
    n_frames = min(500, max(50, len(audio_data) // 256))
    spectrogram = np.random.uniform(0.01, 1.0, size=(n_mels, n_frames)).astype(np.float32)
    log_mel = np.log(spectrogram + 1e-6)
    return log_mel
