const { db } = require('../config/firebase');
const { COLLECTIONS } = require('../utils/constants');

const requireAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.userRole = 'admin';
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authorization failed' });
  }
};

const requireTeacher = async (req, res, next) => {
  try {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(req.user.uid).get();
    if (!userDoc.exists || !['admin', 'teacher'].includes(userDoc.data().role)) {
      return res.status(403).json({ success: false, message: 'Teacher access required' });
    }
    req.userRole = userDoc.data().role;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authorization failed' });
  }
};

module.exports = { requireAdmin, requireTeacher };
