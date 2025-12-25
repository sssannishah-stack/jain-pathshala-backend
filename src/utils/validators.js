const { body, param, query } = require('express-validator');

const validateAttendance = [
  body('studentId').notEmpty().withMessage('Student ID required'),
  body('status').isIn(['present', 'absent', 'late']).withMessage('Invalid status'),
  body('date').isISO8601().withMessage('Invalid date format')
];

const validateGatha = [
  body('title').notEmpty().withMessage('Title required'),
  body('content').notEmpty().withMessage('Content required'),
  body('language').isIn(['hindi', 'english', 'gujarati']).withMessage('Invalid language')
];

const validateUser = [
  body('email').isEmail().withMessage('Invalid email'),
  body('name').notEmpty().withMessage('Name required'),
  body('role').isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role')
];

module.exports = { validateAttendance, validateGatha, validateUser };
