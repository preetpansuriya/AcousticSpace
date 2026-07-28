import unittest
import numpy as np
from ml.feature_extraction.rir_extractor import extract_room_impulse_response
from ml.models.fusion_net import EnsembleAcousticFusionNet

class TestMLComponents(unittest.TestCase):
    def test_rir_extraction(self):
        audio_data = np.random.normal(0, 0.1, 1000)
        res = extract_room_impulse_response(audio_data)
        self.assertIn("rt60_seconds", res)
        self.assertIn("reflection_mismatch_score", res)
        
    def test_fusion_net(self):
        fusion = EnsembleAcousticFusionNet()
        score = fusion.fuse(90.0, 80.0, 15.0)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 100.0)

if __name__ == "__main__":
    unittest.main()
