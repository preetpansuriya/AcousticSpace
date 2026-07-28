#!/usr/bin/env python3
"""
Trains the Audio Spectrogram Transformer (AST) neural net.
"""
from ml.training.trainer import ASTModelTrainer

def main():
    print("[Train Script] Initializing AST model fine-tuning...")
    trainer = ASTModelTrainer(epochs=3)
    trainer.train_epoch("datasets/real_vs_fake_audio")
    print("[Train Script] Saved AST transformer weights to models/ast_model.pt")

if __name__ == "__main__":
    main()
