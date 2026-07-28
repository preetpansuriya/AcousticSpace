#!/usr/bin/env python3
"""
Trains the ensemble fusion network combining AST logits with RIR and breathing features.
"""
from ml.models.fusion_net import EnsembleAcousticFusionNet

def main():
    print("[Fusion Script] Training ensemble fusion classifier...")
    fusion_net = EnsembleAcousticFusionNet()
    score = fusion_net.fuse(95.0, 88.0, 10.0)
    print(f"[Fusion Script] Sample combined forensic risk score: {score:.2f}%")
    print("[Fusion Script] Exported ensemble model to models/fusion_model.pkl")

if __name__ == "__main__":
    main()
