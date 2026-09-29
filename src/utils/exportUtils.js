import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export Records to CSV File
export function exportToCSV(records, filename = 'food_waste_report.csv') {
  if (!records || !records.length) {
    alert('No waste records available to export.');
    return;
  }

  const headers = [
    'ID',
    'Date',
    'Meal Type',
    'Department',
    'Category',
    'Dish Name',
    'Quantity (kg)',
    'Unit Cost ($)',
    'Total Cost ($)',
    'Reason for Waste',
    'Action / Prevention Plan',
    'Recorded By',
    'Facility Type'
  ];

  const csvRows = [headers.join(',')];

  records.forEach(r => {
    const row = [
      r.id,
      `"${r.date}"`,
      `"${r.meal_type || ''}"`,
      `"${r.department || ''}"`,
      `"${r.category || ''}"`,
      `"${(r.dish_name || '').replace(/"/g, '""')}"`,
      r.quantity_kg,
      r.unit_cost,
      r.total_cost || (r.quantity_kg * r.unit_cost).toFixed(2),
      `"${(r.reason || '').replace(/"/g, '""')}"`,
      `"${(r.action_prevention || '').replace(/"/g, '""')}"`,
      `"${r.recorded_by || ''}"`,
      `"${r.facility_type || ''}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate PDF Audit & Executive Report
export function exportToPDF(records, stats, facilityName = 'EcoWaste Enterprise Organization') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Color Palette
  const emeraldPrimary = '#10b981';
  const darkNavy = '#0f172a';
  const textDark = '#334155';
  const textMuted = '#64748b';

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // dark navy
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(16, 185, 129); // emerald glow
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('EcoWaste Pro', 14, 16);

  doc.setTextColor(241, 245, 249);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Food Waste Deduction & Reduction Audit Report', 14, 23);

  // Facility Info & Date
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`Facility: ${facilityName}`, 140, 15);
  doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 140, 21);
  doc.text('Status: Verified Executive Report', 140, 27);

  // 2. Executive Summary Metrics Cards Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 28, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 28, 3, 3, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL WASTE VOLUME', 20, 46);
  doc.text('TOTAL FINANCIAL LOSS', 70, 46);
  doc.text('RECORDED ENTRIES', 120, 46);
  doc.text('TOP WASTE SOURCE', 160, 46);

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`${stats.totalKg.toFixed(1)} kg`, 20, 56);
  doc.setTextColor(239, 68, 68); // Red loss
  doc.text(`$${stats.totalCost.toFixed(2)}`, 70, 56);
  doc.setTextColor(15, 23, 42);
  doc.text(`${records.length} Logs`, 120, 56);
  doc.setFontSize(10);
  doc.text(stats.topSource || 'Kitchen Prep', 160, 56);

  // 3. Detailed Records Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Detailed Food Waste Ledger Records', 14, 74);

  const tableBody = records.map(r => [
    r.date,
    r.department,
    r.category,
    r.dish_name,
    `${parseFloat(r.quantity_kg).toFixed(1)} kg`,
    `$${parseFloat(r.unit_cost).toFixed(2)}`,
    `$${(parseFloat(r.quantity_kg) * parseFloat(r.unit_cost)).toFixed(2)}`,
    r.reason
  ]);

  doc.autoTable({
    startY: 78,
    head: [['Date', 'Department', 'Category', 'Dish Item', 'Qty (kg)', 'Unit Cost', 'Total Cost', 'Primary Waste Reason']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // 4. Sign-off Footer
  const finalY = doc.lastAutoTable.finalY + 15;
  if (finalY < 260) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('Audit Verification Sign-Off:', 14, finalY);
    doc.line(14, finalY + 12, 80, finalY + 12);
    doc.text('Head Chef / Operations Director Signature', 14, finalY + 17);

    doc.line(120, finalY + 12, 190, finalY + 12);
    doc.text('Sustainability & Quality Manager Signature', 120, finalY + 17);
  }

  // Save PDF
  doc.save(`EcoWaste_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
