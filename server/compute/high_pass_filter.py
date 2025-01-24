from scipy.signal import butter, filtfilt

class HighPassFilter:
    @staticmethod
    def apply(merged_data: list[dict], cutoff_frequency: float = 0.5, sampling_rate: float = 100.0, order: int = 2) -> None:
        if not merged_data:
            return

        z_values = [row['z'] for row in merged_data]
        nyquist = 0.5 * sampling_rate
        normalized_cutoff = cutoff_frequency / nyquist
        b, a = butter(N=order, Wn=normalized_cutoff, btype='high', analog=False)
        z_filtered = filtfilt(b, a, z_values)
        for i, row in enumerate(merged_data):
            row['z'] = float(z_filtered[i])