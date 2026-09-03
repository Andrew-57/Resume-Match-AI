import AppController from './app.js';

const ExportModule = (function() {
  function exportResults() {
    if (typeof window.jspdf === 'undefined') {
      AppController.showToast('PDF export library not loaded.', 'error');
      return;
    }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const scoreEl = document.getElementById('score-number');
  const score = scoreEl.textContent;
  const matchTitle = document.getElementById('score-title').textContent.replace(/[^\x00-\x7F]/g, '').trim();

  const matched = [...document.querySelectorAll('#matched-skills .skill-tag')].map(t => t.textContent);
  const missing = [...document.querySelectorAll('#missing-skills .skill-tag')].map(t => t.textContent);
  const recs = [...document.querySelectorAll('.rec-item')].map(r => {
    const title = r.querySelector('h4')?.textContent || '';
    const desc = r.querySelector('p')?.textContent || '';
    return { title, desc };
  });

  const skillMatch = document.getElementById('skill-match-value').textContent;
  const expMatch = document.getElementById('exp-match-value').textContent;
  const eduMatch = document.getElementById('edu-match-value').textContent;
  const keyMatch = document.getElementById('key-match-value').textContent;

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 47);
  doc.text('ResumeAI Compatibility Report', 15, y);
  
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 15, y);
  
  // Divider
  y += 5;
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  // Score section
  y += 15;
  doc.setFontSize(36);
  doc.setTextColor(99, 102, 241);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score}%`, 15, y);
  
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text(matchTitle, 15, y + 8);

  // Breakdown Table (manual positioning)
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 47);
  doc.text('Breakdown', 100, y - 10);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const drawRow = (label, value, rowY) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(label, 100, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 47);
    doc.text(value, 150, rowY);
  };
  
  drawRow('Skills:', skillMatch, y - 2);
  drawRow('Experience:', expMatch, y + 4);
  drawRow('Education:', eduMatch, y + 10);
  drawRow('Keywords:', keyMatch, y + 16);

  y += 30;

  // Helper for page breaks
  const checkPageBreak = (neededSpace) => {
    if (y + neededSpace > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // Matched Skills
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 47);
  doc.text('Matched Skills', 15, y);
  
  y += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, pageWidth - 15, y);
  
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const matchedText = matched.length > 0 ? matched.join(', ') : 'None detected';
  const matchedLines = doc.splitTextToSize(matchedText, pageWidth - 30);
  doc.text(matchedLines, 15, y);
  y += matchedLines.length * 6 + 10;

  // Missing Skills
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 47);
  doc.text('Missing Skills', 15, y);
  
  y += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, pageWidth - 15, y);
  
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const missingText = missing.length > 0 ? missing.join(', ') : 'None - great match!';
  const missingLines = doc.splitTextToSize(missingText, pageWidth - 30);
  doc.text(missingLines, 15, y);
  y += missingLines.length * 6 + 10;

  // Recommendations
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 47);
  doc.text('Recommendations', 15, y);
  
  y += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, pageWidth - 15, y);
  
  y += 8;
  
  for (const r of recs) {
    checkPageBreak(25);
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text(`- ${r.title}`, 15, y);
    
    // Description
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(r.desc, pageWidth - 35);
    doc.text(descLines, 20, y);
    
    y += descLines.length * 6 + 8;
  }

    doc.save(`ResumeAI_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    AppController.showToast('Report exported as PDF!', 'success');
  }

  return { exportResults };
})();

export { ExportModule as default };
