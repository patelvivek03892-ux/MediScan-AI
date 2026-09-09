import jsPDF from 'jspdf';
import { MedicalReport } from '../types/medical';

export function exportReportToPdf(report: MedicalReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header styling
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(56, 189, 248); // cyan-400
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MediScan AI', 15, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Automated Clinical Biomarker Intelligence Report', 15, 26);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | ID: ${report.id}`, 130, 26);

  // Patient & Lab Meta Block
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 42, 180, 26, 3, 3, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${report.patientName} (${report.age}y / ${report.gender})`, 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Doctor: ${report.doctorName}`, 20, 57);
  doc.text(`Lab: ${report.laboratory}`, 20, 64);

  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Health Score: ${report.overallHealthScore}/100`, 125, 50);
  doc.text(`Risk Level: ${report.riskLevel}`, 125, 57);
  doc.text(`AI Confidence: ${(report.aiConfidence * 100).toFixed(1)}%`, 125, 64);

  // Executive Summary
  let y = 78;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Clinical Executive Summary', 15, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const splitSummary = doc.splitTextToSize(report.executiveSummary, 180);
  doc.text(splitSummary, 15, y);
  y += splitSummary.length * 4.5 + 6;

  // Biomarkers Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Key Biomarkers & Reference Evaluation', 15, y);
  y += 6;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Biomarker', 18, y + 5);
  doc.text('Result', 70, y + 5);
  doc.text('Ref Interval', 105, y + 5);
  doc.text('Status', 145, y + 5);
  y += 7;

  // Rows
  doc.setFont('helvetica', 'normal');
  report.biomarkers.forEach((bm) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.text(bm.name, 18, y + 5);
    doc.text(`${bm.value} ${bm.unit}`, 70, y + 5);
    doc.text(`${bm.refMin} - ${bm.refMax} ${bm.unit}`, 105, y + 5);

    if (bm.status.includes('CRITICAL')) {
      doc.setTextColor(220, 38, 38);
    } else if (bm.status === 'HIGH' || bm.status === 'LOW') {
      doc.setTextColor(217, 119, 6);
    } else {
      doc.setTextColor(22, 163, 74);
    }
    doc.text(bm.status, 145, y + 5);
    doc.setTextColor(51, 65, 85);

    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 7, 195, y + 7);
    y += 7;
  });

  // Action Plan Summary
  y += 8;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Recommended Doctor Follow-Up Questions', 15, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  report.actionPlan.questionsForDoctor.slice(0, 4).forEach((q) => {
    const splitQ = doc.splitTextToSize(`• ${q}`, 175);
    doc.text(splitQ, 18, y + 4);
    y += splitQ.length * 4.5;
  });

  // Mandatory Disclaimer Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Medical Disclaimer: This AI analysis is for informational purposes only and is not a substitute for diagnosis or advice from a qualified healthcare professional.',
      15,
      290
    );
    doc.text(`Page ${i} of ${pageCount}`, 185, 290);
  }

  doc.save(`MediScan_Report_${report.id}.pdf`);
}

export function exportImagesToPdf(imagesBase64: string[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  imagesBase64.forEach((img, index) => {
    if (index > 0) doc.addPage();
    doc.addImage(img, 'JPEG', 10, 10, 190, 277);
  });

  doc.save(`MediScan_Scanned_Document_${Date.now()}.pdf`);
}
