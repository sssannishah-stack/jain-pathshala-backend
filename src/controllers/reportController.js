const reportService = require('../services/reportService');
const exportService = require('../services/exportService');

const getAttendanceReport = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;
    if (!classId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'classId, startDate and endDate required' });
    }
    const report = await reportService.getAttendanceReport(classId, startDate, endDate);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentProgressReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const progress = await reportService.getStudentProgress(studentId);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportAttendanceReport = async (req, res) => {
  try {
    const { classId, startDate, endDate, format } = req.query;
    const report = await reportService.getAttendanceReport(classId, startDate, endDate);
    const columns = [{ header: 'Student ID', key: 'studentId' }, { header: 'Date', key: 'date' }, { header: 'Status', key: 'status' }];
    if (format === 'pdf') {
      const buffer = await exportService.exportToPDF(report.records, 'Attendance Report');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.pdf');
      return res.send(buffer);
    }
    const buffer = await exportService.exportToExcel(report.records, columns, 'Attendance');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAttendanceReport, getStudentProgressReport, exportAttendanceReport };
