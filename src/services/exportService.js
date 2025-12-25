const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

class ExportService {
  async exportToExcel(data, columns, sheetName = 'Report') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns.map(col => ({ header: col.header, key: col.key, width: col.width || 15 }));
    data.forEach(item => worksheet.addRow(item));
    worksheet.getRow(1).font = { bold: true };
    return workbook.xlsx.writeBuffer();
  }

  async exportToPDF(data, title) {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(20).text(title, { align: 'center' });
      doc.moveDown();
      data.forEach(item => {
        doc.fontSize(12).text(JSON.stringify(item, null, 2));
        doc.moveDown(0.5);
      });
      doc.end();
    });
  }
}

module.exports = new ExportService();
