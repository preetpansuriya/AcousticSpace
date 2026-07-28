import { ForensicReport, BenchmarkSample, AnalysisHistoryItem } from '../types';

export async function fetchHealth(): Promise<{ status: string; geminiActive: boolean }> {
  const res = await fetch('/api/health');
  return res.json();
}

export async function fetchBenchmarkSamples(): Promise<BenchmarkSample[]> {
  const res = await fetch('/api/samples');
  const data = await res.json();
  return data.samples || [];
}

export function getSampleAudioUrl(sampleId: string): string {
  return `/api/samples/${sampleId}/audio`;
}

export async function analyzeBenchmarkSample(sampleId: string): Promise<ForensicReport> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Analysis failed');
  return data.report;
}

export async function analyzeFileUpload(file: File): Promise<ForensicReport> {
  const formData = new FormData();
  formData.append('audioFile', file);
  const res = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Upload analysis failed');
  return data.report;
}

export async function analyzeMicrophoneRecording(audioBase64: string, fileName = 'Mic_Record.wav', isSimulatedFake = false): Promise<ForensicReport> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, fileName, isSimulatedFake })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Recording analysis failed');
  return data.report;
}

export async function fetchHistory(): Promise<AnalysisHistoryItem[]> {
  const res = await fetch('/api/history');
  const data = await res.json();
  return data.history || [];
}

export async function fetchReportById(reportId: string): Promise<ForensicReport> {
  const res = await fetch(`/api/history/${reportId}`);
  const data = await res.json();
  if (!data.report) throw new Error('Report not found');
  return data.report;
}

export async function deleteHistoryItem(reportId: string): Promise<void> {
  await fetch(`/api/history/${reportId}`, { method: 'DELETE' });
}

export async function fetchModelInfo(): Promise<any> {
  const res = await fetch('/api/model-info');
  return res.json();
}
