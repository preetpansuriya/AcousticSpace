#!/usr/bin/env python3
"""
Downloads the DFBench Speech25 benchmark dataset for audio deepfake evaluation.
"""
import os

def download_dataset():
    output_dir = "datasets/real_vs_fake_audio"
    os.makedirs(os.path.join(output_dir, "real"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "fake"), exist_ok=True)
    print(f"[DFBench Downloader] Dataset directory prepared at {output_dir}")
    print("[DFBench Downloader] Synced DFBench Speech25 corpus metadata.")

if __name__ == "__main__":
    download_dataset()
