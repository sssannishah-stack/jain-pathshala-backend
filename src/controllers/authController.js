const { auth, db } = require('../config/firebase');
const { COLLECTIONS } = require('../utils/constants');

const register = async (req, res) => {
  try {
    const { email, password, name, role, phone, parentPhone } = req.body;
    const userRecord = await auth.createUser({ email, password, displayName: name });
    const userData = { uid: userRecord.uid, email, name, role: role || 'student', phone: phone || null, parentPhone: parentPhone || null, createdAt: new Date().toISOString(), isActive: true };
    await db.collection(COLLECTIONS.USERS).doc(userRecord.uid).set(userData);
    res.status(201).json({ success: true, message: 'User registered', data: userData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(req.user.uid).get();
    if (!userDoc.exists) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: userDoc.data() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, language } = req.body;
    const updates = { ...(name && { name }), ...(phone && { phone }), ...(language && { language }), updatedAt: new Date().toISOString() };
    await db.collection(COLLECTIONS.USERS).doc(req.user.uid).update(updates);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, getProfile, updateProfile };
