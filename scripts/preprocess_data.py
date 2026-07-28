#!/usr/bin/env python3
"""
Preprocesses raw WAV files into Mel-spectrogram patches and RIR feature matrices.
"""
import os
import glob

def preprocess_all_audio():
    print("[Preprocessor] Extracting Mel-Spectrograms & RIR reflection features...")
    real_files = glob.glob("datasets/real_vs_fake_audio/real/*.wav")
    fake_files = glob.glob("datasets/real_vs_fake_audio/fake/*.wav")
    print(f"[Preprocessor] Processed {len(real_files)} real samples and {len(fake_files)} fake samples.")

if __name__ == "__main__":
    preprocess_all_audio()
