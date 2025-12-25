const firebaseService = require('../services/firebaseService');
const { COLLECTIONS, ATTENDANCE_STATUS } = require('../utils/constants');
const { formatDate } = require('../utils/helpers');

const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, status, date } = req.body;
    const attendanceDate = date || formatDate(new Date());
    const existingQuery = await firebaseService.getAll(COLLECTIONS.ATTENDANCE, [
      { field: 'studentId', operator: '==', value: studentId },
      { field: 'date', operator: '==', value: attendanceDate }
    ]);
    if (existingQuery.length > 0) {
      const updated = await firebaseService.update(COLLECTIONS.ATTENDANCE, existingQuery[0].id, { status, markedBy: req.user.uid });
      return res.json({ success: true, message: 'Attendance updated', data: updated });
    }
    const attendance = await firebaseService.create(COLLECTIONS.ATTENDANCE, { studentId, classId, status, date: attendanceDate, markedBy: req.user.uid });
    res.status(201).json({ success: true, message: 'Attendance marked', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { classId, date, studentId } = req.query;
    let conditions = [];
    if (classId) conditions.push({ field: 'classId', operator: '==', value: classId });
    if (date) conditions.push({ field: 'date', operator: '==', value: date });
    if (studentId) conditions.push({ field: 'studentId', operator: '==', value: studentId });
    const attendance = await firebaseService.getAll(COLLECTIONS.ATTENDANCE, conditions);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkMarkAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceList } = req.body;
    const attendanceDate = date || formatDate(new Date());
    const results = await Promise.all(attendanceList.map(async (item) => {
      return firebaseService.create(COLLECTIONS.ATTENDANCE, { studentId: item.studentId, classId, status: item.status, date: attendanceDate, markedBy: req.user.uid });
    }));
    res.status(201).json({ success: true, message: `Marked attendance for ${results.length} students`, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { markAttendance, getAttendance, bulkMarkAttendance };
