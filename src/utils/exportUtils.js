import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// JSON Export 
export const exportGoalsJSON = (goals) => {
  const dataStr = JSON.stringify(goals, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  saveAs(blob, `goals-export-${new Date().toISOString().split('T')[0]}.json`);
};

//  CSV Export
export const exportGoalsCSV = (goals) => {
  const headers = ['Title', 'Category', 'Type', 'Target', 'Progress', 'Status', 'Created At'];
  
  const rows = goals.map(goal => [
    goal.title,
    goal.category,
    goal.type,
    goal.target,
    goal.progress,
    goal.status,
    new Date(goal.createdAt).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `goals-export-${new Date().toISOString().split('T')[0]}.csv`);
};

// PDF Export
export const exportGoalsPDF = (goals) => {
  const doc = new jsPDF();
  
  // عنوان
  doc.setFontSize(18);
  doc.text('Goals Export', 14, 22);
  
  // تاریخ
  doc.setFontSize(10);
  doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // جدول
  const tableColumn = ['Title', 'Category', 'Progress', 'Status'];
  const tableRows = goals.map(goal => [
    goal.title,
    goal.category,
    `${goal.progress}/${goal.target}`,
    goal.status
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [54, 138, 199] }
  });

  doc.save(`goals-export-${new Date().toISOString().split('T')[0]}.pdf`);
};