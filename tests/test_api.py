import unittest
from backend.app.services.audio_service import analyze_audio_bytes

class TestAcousticSpaceAPI(unittest.TestCase):
    def test_audio_analysis_service(self):
        sample_bytes = b"test_audio_sample_bytes_12345"
        report = analyze_audio_bytes(sample_bytes, "test_sample.wav")
        self.assertIn("verdict", report)
        self.assertIn("overall_deepfake_probability", report)
        self.assertIn("rir", report)

if __name__ == "__main__":
    unittest.main()
