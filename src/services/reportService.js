const { db } = require('../config/firebase');
const { COLLECTIONS } = require('../utils/constants');

class ReportService {
  async getAttendanceReport(classId, startDate, endDate) {
    const snapshot = await db.collection(COLLECTIONS.ATTENDANCE)
      .where('classId', '==', classId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    const records = snapshot.docs.map(doc => doc.data());
    const stats = { total: records.length, present: records.filter(r => r.status === 'present').length };
    stats.absent = records.filter(r => r.status === 'absent').length;
    stats.late = records.filter(r => r.status === 'late').length;
    stats.attendanceRate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0;
    return { records, stats };
  }

  async getStudentProgress(studentId) {
    const [progressSnap, attendanceSnap] = await Promise.all([
      db.collection(COLLECTIONS.PROGRESS).where('studentId', '==', studentId).get(),
      db.collection(COLLECTIONS.ATTENDANCE).where('studentId', '==', studentId).get()
    ]);
    return {
      gathasLearned: progressSnap.docs.map(doc => doc.data()),
      attendanceRecords: attendanceSnap.docs.map(doc => doc.data())
    };
  }
}

module.exports = new ReportService();
