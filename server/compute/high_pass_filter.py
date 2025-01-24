from scipy.signal import butter, filtfilt

class HighPassFilter:
    @staticmethod
    def apply(z_values: list[float], cutoff_frequency: float = 0.5, sampling_rate: float = 100.0, order: int = 2) -> list[float]:
        if not z_values:
            return

        nyquist = 0.5 * sampling_rate
        normalized_cutoff = cutoff_frequency / nyquist
        b, a = butter(N=order, Wn=normalized_cutoff, btype='high', analog=False)
        z_filtered = filtfilt(b, a, z_values)
        return z_filtered