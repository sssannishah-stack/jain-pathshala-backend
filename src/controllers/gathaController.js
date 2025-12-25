const firebaseService = require('../services/firebaseService');
const { COLLECTIONS } = require('../utils/constants');

const createGatha = async (req, res) => {
  try {
    const { title, content, meaning, language, category, audioUrl, order } = req.body;
    const gatha = await firebaseService.create(COLLECTIONS.GATHAS, { title, content, meaning, language: language || 'hindi', category, audioUrl, order: order || 0, createdBy: req.user.uid });
    res.status(201).json({ success: true, message: 'Gatha created', data: gatha });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllGathas = async (req, res) => {
  try {
    const { language, category } = req.query;
    let conditions = [];
    if (language) conditions.push({ field: 'language', operator: '==', value: language });
    if (category) conditions.push({ field: 'category', operator: '==', value: category });
    const gathas = await firebaseService.getAll(COLLECTIONS.GATHAS, conditions, 'order');
    res.json({ success: true, data: gathas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGathaById = async (req, res) => {
  try {
    const gatha = await firebaseService.getById(COLLECTIONS.GATHAS, req.params.id);
    if (!gatha) return res.status(404).json({ success: false, message: 'Gatha not found' });
    res.json({ success: true, data: gatha });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateGatha = async (req, res) => {
  try {
    const updated = await firebaseService.update(COLLECTIONS.GATHAS, req.params.id, req.body);
    res.json({ success: true, message: 'Gatha updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGatha = async (req, res) => {
  try {
    await firebaseService.delete(COLLECTIONS.GATHAS, req.params.id);
    res.json({ success: true, message: 'Gatha deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markGathaLearned = async (req, res) => {
  try {
    const { gathaId } = req.params;
    const progress = await firebaseService.create(COLLECTIONS.PROGRESS, { studentId: req.user.uid, gathaId, learnedAt: new Date().toISOString(), score: req.body.score || null });
    res.status(201).json({ success: true, message: 'Progress saved', data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createGatha, getAllGathas, getGathaById, updateGatha, deleteGatha, markGathaLearned };
