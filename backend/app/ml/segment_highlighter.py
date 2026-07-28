"""
AcousticSpace - Temporal Segment Highlighter
Extracts exact start/end timestamps of suspicious regions for forensic UI waveform rendering.
"""

from typing import List, Dict, Any

class SegmentHighlighter:
    @staticmethod
    def highlight_suspicious_windows(
        anomalies: List[Dict[str, Any]],
        waveform_length: int
    ) -> List[Dict[str, Any]]:
        """
        Maps anomaly timestamps to waveform bar indices for UI rendering.
        """
        highlighted = []
        for a in anomalies:
            highlighted.append({
                "start_time": a.get("timestamp_start", 0.0),
                "end_time": a.get("timestamp_end", 1.0),
                "severity": a.get("severity", "MEDIUM"),
                "label": a.get("mismatch_type", "ANOMALY"),
                "color_hex": "#ef4444" if a.get("severity") == "CRITICAL" else "#f59e0b"
            })
        return highlighted
