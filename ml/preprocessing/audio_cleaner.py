import numpy as np


def normalize_audio_signal(
    audio_data: np.ndarray,
    target_peak: float = 0.95
) -> np.ndarray:
    """
    Normalize an audio waveform to the target peak level.

    The function also handles empty input and invalid numeric values
    before normalization.
    """

    if audio_data is None or audio_data.size == 0:
        return np.array([], dtype=np.float32)

    # Convert input to floating-point format
    audio_data = np.asarray(audio_data, dtype=np.float32)

    # Replace NaN and infinite values with zero
    audio_data = np.nan_to_num(
        audio_data,
        nan=0.0,
        posinf=0.0,
        neginf=0.0
    )

    # Keep target peak within a safe range
    target_peak = float(np.clip(target_peak, 0.0, 1.0))

    max_val = np.max(np.abs(audio_data))

    if max_val > 1e-6 and target_peak > 0:
        audio_data = (audio_data / max_val) * target_peak

    return audio_data