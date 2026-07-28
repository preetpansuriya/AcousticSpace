import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ForensicReport } from '../types';

/**
 * Utility to export a ForensicReport as a formatted PDF file using html2canvas and jsPDF.
 */
export async function exportReportToPDF(report: ForensicReport, elementId: string = 'forensic-pdf-report-container'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id ${elementId} not found for PDF export. Falling back to text-based jsPDF.`);
    generateDirectPDF(report);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution capture
      useCORS: true,
      logging: false,
      backgroundColor: '#090d16', // Cyberpunk dark background theme
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`AcousticSpace_Report_${report.fileName.replace(/[^a-zA-Z0-0]/g, '_')}_${report.id.slice(0, 6)}.pdf`);
  } catch (error) {
    console.error('Error rendering HTML to PDF canvas:', error);
    generateDirectPDF(report);
  }
}

/**
 * Fallback direct PDF generator with formatted tables and text
 */
export function generateDirectPDF(report: ForensicReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(6, 182, 212); // Cyan-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ACOUSTICSPACE FORENSICS REPORT', 14, 18);

  doc.setTextColor(148, 163, 184); // Slate-400
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report ID: ${report.id} | Generated: ${new Date(report.createdAt).toLocaleString()}`, 14, 26);

  // Verdict Box
  const isSpoof = report.verdict === 'DEEPFAKE_SPOOF';
  const isSuspicious = report.verdict === 'SUSPICIOUS_SYNTHETIC';

  if (isSpoof) {
    doc.setFillColor(225, 29, 72); // Red-600
  } else if (isSuspicious) {
    doc.setFillColor(217, 119, 6); // Amber-600
  } else {
    doc.setFillColor(16, 185, 129); // Emerald-500
  }
  doc.rect(14, 42, 182, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`VERDICT: ${report.verdict.replace(/_/g, ' ')}`, 20, 53);
  doc.text(`Deepfake Risk: ${report.overallDeepfakeProbability}%`, 130, 53);

  // File Overview Table
  let y = 68;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. File & Analysis Overview', 14, y);

  y += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const overviewRows = [
    ['Target Audio File:', report.fileName, 'File Size:', `${report.fileSizeMb} MB`],
    ['Duration:', `${report.durationSeconds} seconds`, 'Sample Rate:', `${report.sampleRateHz} Hz`],
    ['Audio Source:', report.sourceType.toUpperCase(), 'Confidence Score:', `${report.confidenceScore}%`],
  ];

  overviewRows.forEach(row => {
    y += 6;
    doc.text(`${row[0]} ${row[1]}`, 14, y);
    doc.text(`${row[2]} ${row[3]}`, 110, y);
  });

  // Acoustic Metrics Table
  y += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Physical Forensic Metrics Breakdown Table', 14, y);

  y += 6;
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 4, 182, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Metric Parameter', 18, y);
  doc.text('Measured', 80, y);
  doc.text('Expected Ref', 120, y);
  doc.text('Anomaly Status', 160, y);

  doc.setFont('helvetica', 'normal');
  const metricsData = [
    ['RIR RT60 Decay Time', `${report.rir.rt60Seconds}s`, `${report.rir.expectedRt60Seconds}s`, report.rir.rt60Seconds !== report.rir.expectedRt60Seconds ? 'Mismatch' : 'Normal'],
    ['Wall Reflection Mismatch', `${report.rir.reflectionMismatchScore}%`, '< 25%', report.rir.reflectionMismatchScore > 40 ? 'HIGH RISK' : 'PASS'],
    ['Speech Clarity C50 Index', `${report.rir.clarityC50Db} dB`, '> 3.0 dB', report.rir.clarityC50Db < 2.0 ? 'Atypical' : 'PASS'],
    ['Diaphragm Breaths Count', `${report.breathing.detectedBreathsCount}`, `${report.breathing.expectedBreathsCount}`, report.breathing.detectedBreathsCount === 0 ? 'Missing Breaths' : 'Normal'],
    ['Breath Cadence Sync Score', `${report.breathing.cadenceSynchronyScore}%`, '> 70%', report.breathing.cadenceSynchronyScore < 50 ? 'Synthetic' : 'PASS'],
    ['Vocoder Phase Drop Index', `${report.spectral.phaseDiscontinuityIndex}%`, '< 15%', report.spectral.phaseDiscontinuityIndex > 30 ? 'Vocoder Discontinuity' : 'PASS'],
  ];

  metricsData.forEach(row => {
    y += 7;
    doc.setTextColor(51, 65, 85);
    doc.text(row[0], 18, y);
    doc.text(row[1], 80, y);
    doc.text(row[2], 120, y);
    if (row[3].includes('RISK') || row[3].includes('Mismatch') || row[3].includes('Synthetic') || row[3].includes('Discontinuity')) {
      doc.setTextColor(225, 29, 72);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(row[3], 160, y);
    doc.setFont('helvetica', 'normal');
  });

  // Key Physical Evidences
  y += 12;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Key Physical Evidences Found', 14, y);

  y += 2;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  report.keyEvidences.forEach(evidence => {
    y += 6;
    doc.text(`• ${evidence}`, 18, y);
  });

  // Recommended Action
  y += 12;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Recommended SOC Action', 14, y);

  y += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const splitAction = doc.splitTextToSize(report.recommendedAction, 180);
  doc.text(splitAction, 14, y);

  // Footer Signature Line
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 275, 196, 275);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('AcousticSpace Physical Forensics Engine v2.4 | Automated Authentication Stamp', 14, 280);

  doc.save(`AcousticSpace_Report_${report.fileName.replace(/[^a-zA-Z0-9]/g, '_')}_${report.id.slice(0, 6)}.pdf`);
}
