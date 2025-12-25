const express = require('express');
const router = express.Router();
const { createGatha, getAllGathas, getGathaById, updateGatha, deleteGatha, markGathaLearned } = require('../controllers/gathaController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/adminMiddleware');

router.get('/', getAllGathas);
router.get('/:id', getGathaById);
router.post('/', authenticate, requireTeacher, createGatha);
router.put('/:id', authenticate, requireTeacher, updateGatha);
router.delete('/:id', authenticate, requireTeacher, deleteGatha);
router.post('/:gathaId/learn', authenticate, markGathaLearned);

module.exports = router;
