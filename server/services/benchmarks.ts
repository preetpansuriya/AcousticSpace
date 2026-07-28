import { BenchmarkSample } from '../../src/types';

export const BENCHMARK_SAMPLES: BenchmarkSample[] = [
  {
    id: 'dfbench_speech25_01',
    title: 'DFBench Speech25 - AI Voice Clone in Dry Room',
    datasetName: 'DFBench Speech25 (HuggingFace)',
    category: 'Deepfake AI Clone',
    groundTruth: 'FAKE',
    durationSeconds: 8.5,
    description: 'Neural voice clone generated with ElevenLabs API. Speech is articulate but completely lacks natural room wall reflections (RIR = 0.02s) despite ambient background noise containing reverberant echo.',
    targetEnvironment: 'Corporate Office Room (Alleged)',
    expectedVerdict: 'DEEPFAKE_SPOOF',
    waveType: 'flat_ai'
  },
  {
    id: 'asvspoof_real_88',
    title: 'ASVspoof 2021 - Authentic Security Briefing',
    datasetName: 'ASVspoof 2021 Evaluation',
    category: 'Authentic',
    groundTruth: 'REAL',
    durationSeconds: 12.0,
    description: 'Real human speech recorded in a medium conference room (approx 45m³). Natural acoustic wall reflections match RT60 of 0.44s with clear diaphragm inhalation pauses every 3.2 seconds.',
    targetEnvironment: 'Conference Room 3B',
    expectedVerdict: 'AUTHENTIC',
    waveType: 'reverb_room'
  },
  {
    id: 'ceo_wire_fraud_03',
    title: 'CEO Emergency Wire Transfer Request',
    datasetName: 'Infotact Threat Intel Case #4091',
    category: 'Deepfake AI Clone',
    groundTruth: 'FAKE',
    durationSeconds: 10.2,
    description: 'Urgent voice memo sent via WhatsApp impersonating Executive Officer. Zero breathing pauses observed across 182 words per minute, with vocoder phase drops at high frequencies (>6kHz).',
    targetEnvironment: 'Executive Office / Vehicle',
    expectedVerdict: 'DEEPFAKE_SPOOF',
    waveType: 'flat_ai'
  },
  {
    id: 'dfbench_speech25_real_12',
    title: 'DFBench Speech25 - Genuine Phone Interview',
    datasetName: 'DFBench Speech25 (HuggingFace)',
    category: 'Authentic',
    groundTruth: 'REAL',
    durationSeconds: 9.8,
    description: 'Legitimate interview clip over cellular codec. Contains physiological breath pauses, subtle background HVAC resonance matching vocal room impulse response.',
    targetEnvironment: 'Home Office Studio',
    expectedVerdict: 'AUTHENTIC',
    waveType: 'sine_speech'
  },
  {
    id: 'xtts_spliced_hybrid_99',
    title: 'Spliced Hybrid - Authentic Intro with AI Body',
    datasetName: 'Custom Audio Synthetic Attack',
    category: 'Spliced Hybrid',
    groundTruth: 'FAKE',
    durationSeconds: 14.0,
    description: 'First 3.5 seconds feature genuine human voice recording, followed by an abrupt RT60 jump from 0.38s down to 0.01s where TTS text was inserted into the middle of a sentence.',
    targetEnvironment: 'Quiet Studio / Hybrid Splice',
    expectedVerdict: 'SUSPICIOUS_SYNTHETIC',
    waveType: 'spliced'
  }
];

/**
 * Generates a valid PCM WAV audio Buffer for demonstration and playback
 */
export function generateSyntheticWavBuffer(sampleRate = 22050, duration = 8, waveType: string = 'reverb_room'): Buffer {
  const numSamples = Math.floor(sampleRate * duration);
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const chunkSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate PCM samples with speech harmonics + room reverb / noise
  let writeOffset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Base fundamental speech formants (F0 ~ 130Hz - 220Hz)
    const pitch = 160 + Math.sin(t * 4) * 20;
    const formant1 = pitch * 1.5;
    const formant2 = pitch * 3.2;

    // Speech envelope (silence every ~2.5 sec for breaths in real audio)
    const speechCycle = t % 3.0;
    const isSpeaking = waveType === 'flat_ai' ? true : (speechCycle < 2.3);
    const envelope = isSpeaking ? (0.6 + 0.3 * Math.sin(t * 12)) : 0.05;

    // Inhalation breath sound during pause (for real audio)
    let breathNoise = 0;
    if (!isSpeaking && waveType !== 'flat_ai') {
      const breathT = speechCycle - 2.3;
      if (breathT > 0.1 && breathT < 0.6) {
        breathNoise = (Math.random() * 2 - 1) * Math.sin((breathT / 0.5) * Math.PI) * 0.15;
      }
    }

    if (isSpeaking) {
      sample = (Math.sin(2 * Math.PI * pitch * t) * 0.5 +
                Math.sin(2 * Math.PI * formant1 * t) * 0.3 +
                Math.sin(2 * Math.PI * formant2 * t) * 0.2);
    } else {
      sample = breathNoise;
    }

    // Apply Room Reverb / Echo
    if (waveType === 'reverb_room') {
      // Add simulated early reflections
      const delay1 = Math.floor(0.025 * sampleRate); // 25ms wall reflection
      const delay2 = Math.floor(0.060 * sampleRate); // 60ms wall reflection
      let echo1 = 0;
      let echo2 = 0;
      if (i > delay1) {
        echo1 = buffer.readInt16LE(44 + (i - delay1) * 2) / 32768.0 * 0.25;
      }
      if (i > delay2) {
        echo2 = buffer.readInt16LE(44 + (i - delay2) * 2) / 32768.0 * 0.15;
      }
      sample = sample * envelope + echo1 + echo2;
    } else if (waveType === 'flat_ai') {
      // Extremely dry, zero room impulse, slight metallic robotic jitter
      const jitter = (Math.random() - 0.5) * 0.02;
      sample = sample * envelope + jitter;
    } else if (waveType === 'spliced') {
      // Spliced: first half reverb, second half ultra-dry
      if (t < duration / 2) {
        const delay1 = Math.floor(0.03 * sampleRate);
        const echo1 = i > delay1 ? buffer.readInt16LE(44 + (i - delay1) * 2) / 32768.0 * 0.3 : 0;
        sample = sample * envelope + echo1;
      } else {
        sample = sample * envelope;
      }
    } else {
      sample = sample * envelope;
    }

    // Add mild white noise floor
    sample += (Math.random() * 2 - 1) * 0.008;

    // Clamp to int16 range
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 28000)));
    buffer.writeInt16LE(intSample, writeOffset);
    writeOffset += 2;
  }

  return buffer;
}
