const express = require('express');
const router = express.Router();
const { getAttendanceReport, getStudentProgressReport, exportAttendanceReport } = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/adminMiddleware');

router.get('/attendance', authenticate, requireTeacher, getAttendanceReport);
router.get('/student/:studentId/progress', authenticate, getStudentProgressReport);
router.get('/attendance/export', authenticate, requireTeacher, exportAttendanceReport);

module.exports = router;
