// src/services/exportService.js
const PDFDocument = require('pdfkit');
const xl = require('excel4node');
const reportService = require('./reportService');
const { MONTHS } = require('../utils/constants');

class ExportService {
  // Generate PDF report
  async generatePDF(memberId, memberName, year, month) {
    const report = await reportService.generateMonthlyReport(memberId, year, month);
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        
        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('Jain Pathshala', { align: 'center' });
        
        doc.fontSize(16)
           .font('Helvetica')
           .text('Monthly Attendance Report', { align: 'center' });
        
        doc.moveDown();
        
        // Student Info
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(`Student: ${memberName}`);
        
        doc.font('Helvetica')
           .text(`Period: ${MONTHS[month - 1]} ${year}`);
        
        doc.moveDown();
        
        // Summary Box
        doc.rect(50, doc.y, 500, 80)
           .stroke();
        
        const summaryY = doc.y + 10;
        
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('Summary', 60, summaryY);
        
        doc.font('Helvetica')
           .text(`Days Present: ${report.summary.daysPresent} / ${report.period.totalDays} (${report.summary.attendancePercentage}%)`, 60, summaryY + 20);
        
        doc.text(`New Gatha: ${report.summary.totalNewGatha}`, 60, summaryY + 35);
        doc.text(`Revision Gatha: ${report.summary.totalRevisionGatha}`, 60, summaryY + 50);
        
        doc.y = summaryY + 90;
        doc.moveDown();
        
        // Attendance Calendar
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Attendance Calendar');
        
        doc.moveDown(0.5);
        
        // Draw calendar grid
        const calendarStartX = 50;
        const calendarStartY = doc.y;
        const cellWidth = 70;
        const cellHeight = 25;
        
        // Days header
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach((day, i) => {
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .text(day, calendarStartX + (i * cellWidth), calendarStartY, {
               width: cellWidth,
               align: 'center'
             });
        });
        
        // Calendar days
        const firstDay = new Date(year, month - 1, 1).getDay();
        let currentX = calendarStartX + (firstDay * cellWidth);
        let currentY = calendarStartY + cellHeight;
        
        report.dailyBreakdown.forEach((day, index) => {
          const dayOfWeek = new Date(day.date).getDay();
          
          if (dayOfWeek === 0 && index > 0) {
            currentX = calendarStartX;
            currentY += cellHeight;
          }
          
          // Draw cell
          doc.rect(currentX, currentY, cellWidth, cellHeight).stroke();
          
          // Day number
          doc.fontSize(10)
             .font(day.present ? 'Helvetica-Bold' : 'Helvetica')
             .fillColor(day.present ? 'green' : 'black')
             .text(day.day.toString(), currentX, currentY + 7, {
               width: cellWidth,
               align: 'center'
             });
          
          // Present marker
          if (day.present) {
            doc.fillColor('green')
               .text('✓', currentX + cellWidth - 20, currentY + 7);
          }
          
          doc.fillColor('black');
          currentX += cellWidth;
        });
        
        doc.y = currentY + cellHeight + 20;
        
        // Sutra Progress
        if (report.sutraProgress.length > 0) {
          doc.addPage();
          
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text('Sutra Progress');
          
          doc.moveDown();
          
          // Table header
          const tableStartX = 50;
          let tableY = doc.y;
          
          doc.fontSize(10)
             .font('Helvetica-Bold');
          
          doc.text('Sutra Name', tableStartX, tableY);
          doc.text('New', tableStartX + 200, tableY);
          doc.text('Revision', tableStartX + 280, tableY);
          doc.text('Entries', tableStartX + 360, tableY);
          
          doc.moveTo(tableStartX, tableY + 15)
             .lineTo(tableStartX + 450, tableY + 15)
             .stroke();
          
          tableY += 25;
          
          doc.font('Helvetica');
          
          report.sutraProgress.forEach(sutra => {
            doc.text(sutra.sutraName, tableStartX, tableY);
            doc.text(sutra.newGatha.toString(), tableStartX + 200, tableY);
            doc.text(sutra.revisionGatha.toString(), tableStartX + 280, tableY);
            doc.text(sutra.totalEntries.toString(), tableStartX + 360, tableY);
            tableY += 20;
          });
        }
        
        // Footer
        doc.fontSize(10)
           .font('Helvetica')
           .text(
             'Generated on ' + new Date().toLocaleDateString(),
             50,
             doc.page.height - 50,
             { align: 'center' }
           );
        
        doc.text('🙏 Jai Jinendra 🙏', { align: 'center' });
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Generate Excel report
  async generateExcel(memberId, memberName, year, month) {
    const report = await reportService.generateMonthlyReport(memberId, year, month);
    
    const wb = new xl.Workbook();
    
    // Styles
    const headerStyle = wb.createStyle({
      font: { bold: true, size: 12 },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#667eea' },
      font: { color: '#FFFFFF', bold: true }
    });
    
    const titleStyle = wb.createStyle({
      font: { bold: true, size: 16 }
    });
    
    const presentStyle = wb.createStyle({
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#d4edda' }
    });
    
    const absentStyle = wb.createStyle({
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#f8d7da' }
    });
    
    // Summary Sheet
    const summarySheet = wb.addWorksheet('Summary');
    
    summarySheet.cell(1, 1).string('Jain Pathshala - Monthly Report').style(titleStyle);
    summarySheet.cell(2, 1).string(`Student: ${memberName}`);
    summarySheet.cell(3, 1).string(`Period: ${MONTHS[month - 1]} ${year}`);
    
    summarySheet.cell(5, 1).string('Metric').style(headerStyle);
    summarySheet.cell(5, 2).string('Value').style(headerStyle);
    
    summarySheet.cell(6, 1).string('Days Present');
    summarySheet.cell(6, 2).number(report.summary.daysPresent);
    
    summarySheet.cell(7, 1).string('Total Days');
    summarySheet.cell(7, 2).number(report.period.totalDays);
    
    summarySheet.cell(8, 1).string('Attendance %');
    summarySheet.cell(8, 2).number(report.summary.attendancePercentage);
    
    summarySheet.cell(9, 1).string('New Gatha');
    summarySheet.cell(9, 2).number(report.summary.totalNewGatha);
    
    summarySheet.cell(10, 1).string('Revision Gatha');
    summarySheet.cell(10, 2).number(report.summary.totalRevisionGatha);
    
    // Attendance Sheet
    const attendanceSheet = wb.addWorksheet('Attendance');
    
    attendanceSheet.cell(1, 1).string('Date').style(headerStyle);
    attendanceSheet.cell(1, 2).string('Day').style(headerStyle);
    attendanceSheet.cell(1, 3).string('Status').style(headerStyle);
    
    report.dailyBreakdown.forEach((day, index) => {
      const row = index + 2;
      attendanceSheet.cell(row, 1).string(day.date);
      attendanceSheet.cell(row, 2).string(day.dayName);
      attendanceSheet.cell(row, 3).string(day.present ? 'Present' : 'Absent')
        .style(day.present ? presentStyle : absentStyle);
    });
    
    // Gatha Sheet
    const gathaSheet = wb.addWorksheet('Gatha');
    
    gathaSheet.cell(1, 1).string('Date').style(headerStyle);
    gathaSheet.cell(1, 2).string('Sutra').style(headerStyle);
    gathaSheet.cell(1, 3).string('Type').style(headerStyle);
    gathaSheet.cell(1, 4).string('Gatha No').style(headerStyle);
    gathaSheet.cell(1, 5).string('Total').style(headerStyle);
    
    report.rawData.gatha.forEach((gatha, index) => {
      const row = index + 2;
      gathaSheet.cell(row, 1).string(gatha.date);
      gathaSheet.cell(row, 2).string(gatha.sutraName);
      gathaSheet.cell(row, 3).string(gatha.type);
      gathaSheet.cell(row, 4).number(gatha.gathaNo);
      gathaSheet.cell(row, 5).number(gatha.totalGatha);
    });
    
    // Sutra Progress Sheet
    const progressSheet = wb.addWorksheet('Sutra Progress');
    
    progressSheet.cell(1, 1).string('Sutra Name').style(headerStyle);
    progressSheet.cell(1, 2).string('New Gatha').style(headerStyle);
    progressSheet.cell(1, 3).string('Revision').style(headerStyle);
    progressSheet.cell(1, 4).string('Total Entries').style(headerStyle);
    
    report.sutraProgress.forEach((sutra, index) => {
      const row = index + 2;
      progressSheet.cell(row, 1).string(sutra.sutraName);
      progressSheet.cell(row, 2).number(sutra.newGatha);
      progressSheet.cell(row, 3).number(sutra.revisionGatha);
      progressSheet.cell(row, 4).number(sutra.totalEntries);
    });
    
    // Return as buffer
    return new Promise((resolve, reject) => {
      wb.writeToBuffer().then(buffer => {
        resolve(buffer);
      }).catch(reject);
    });
  }
  
  // Generate all students Excel report (admin)
  async generateAllStudentsExcel(year, month) {
    const report = await reportService.generateAllStudentsReport(year, month);
    
    const wb = new xl.Workbook();
    
    const headerStyle = wb.createStyle({
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#667eea' },
      font: { color: '#FFFFFF', bold: true }
    });
    
    const sheet = wb.addWorksheet('All Students');
    
    // Title
    sheet.cell(1, 1).string(`All Students Report - ${MONTHS[month - 1]} ${year}`);
    
    // Headers
    sheet.cell(3, 1).string('Group').style(headerStyle);
    sheet.cell(3, 2).string('Student Name').style(headerStyle);
    sheet.cell(3, 3).string('Days Present').style(headerStyle);
    sheet.cell(3, 4).string('New Gatha').style(headerStyle);
    sheet.cell(3, 5).string('Revision').style(headerStyle);
    
    // Data
    report.reports.forEach((student, index) => {
      const row = index + 4;
      sheet.cell(row, 1).string(student.groupName);
      sheet.cell(row, 2).string(student.memberName);
      sheet.cell
