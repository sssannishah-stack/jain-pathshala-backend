const express = require('express');
const router = express.Router();
const { getStudentDashboard, getMyProgress, getMyAttendance } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/dashboard', getStudentDashboard);
router.get('/progress', getMyProgress);
router.get('/attendance', getMyAttendance);

module.exports = router;
