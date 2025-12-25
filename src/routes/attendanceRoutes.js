const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, bulkMarkAttendance } = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/adminMiddleware');

router.post('/', authenticate, requireTeacher, markAttendance);
router.get('/', authenticate, getAttendance);
router.post('/bulk', authenticate, requireTeacher, bulkMarkAttendance);

module.exports = router;
