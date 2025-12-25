const { db } = require('../config/firebase');
const { COLLECTIONS } = require('../utils/constants');
const firebaseService = require('../services/firebaseService');

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.uid;
    const [progressSnap, attendanceSnap] = await Promise.all([
      db.collection(COLLECTIONS.PROGRESS).where('studentId', '==', userId).get(),
      db.collection(COLLECTIONS.ATTENDANCE).where('studentId', '==', userId).orderBy('date', 'desc').limit(30).get()
    ]);
    const attendanceRecords = attendanceSnap.docs.map(d => d.data());
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    res.json({
      success: true,
      data: {
        gathasLearned: progressSnap.size,
        recentAttendance: attendanceRecords,
        attendanceRate: attendanceRecords.length > 0 ? ((presentCount / attendanceRecords.length) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyProgress = async (req, res) => {
  try {
    const progress = await firebaseService.getAll(COLLECTIONS.PROGRESS, [{ field: 'studentId', operator: '==', value: req.user.uid }]);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let conditions = [{ field: 'studentId', operator: '==', value: req.user.uid }];
    if (startDate) conditions.push({ field: 'date', operator: '>=', value: startDate });
    if (endDate) conditions.push({ field: 'date', operator: '<=', value: endDate });
    const attendance = await firebaseService.getAll(COLLECTIONS.ATTENDANCE, conditions);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudentDashboard, getMyProgress, getMyAttendance };
