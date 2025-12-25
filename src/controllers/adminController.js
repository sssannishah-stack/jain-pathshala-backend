const { db, auth } = require('../config/firebase');
const { COLLECTIONS } = require('../utils/constants');

const getDashboardStats = async (req, res) => {
  try {
    const [usersSnap, gathasSnap, attendanceSnap, classesSnap] = await Promise.all([
      db.collection(COLLECTIONS.USERS).get(),
      db.collection(COLLECTIONS.GATHAS).get(),
      db.collection(COLLECTIONS.ATTENDANCE).where('date', '==', new Date().toISOString().split('T')[0]).get(),
      db.collection(COLLECTIONS.CLASSES).get()
    ]);
    const users = usersSnap.docs.map(d => d.data());
    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalStudents: users.filter(u => u.role === 'student').length,
        totalTeachers: users.filter(u => u.role === 'teacher').length,
        totalGathas: gathasSnap.size,
        todayAttendance: attendanceSnap.size,
        totalClasses: classesSnap.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    let query = db.collection(COLLECTIONS.USERS);
    if (role) query = query.where('role', '==', role);
    if (isActive !== undefined) query = query.where('isActive', '==', isActive === 'true');
    const snapshot = await query.get();
    res.json({ success: true, data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates.uid;
    delete updates.email;
    await db.collection(COLLECTIONS.USERS).doc(id).update(updates);
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await auth.deleteUser(id);
    await db.collection(COLLECTIONS.USERS).doc(id).delete();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, teacherId, schedule, description } = req.body;
    const docRef = db.collection(COLLECTIONS.CLASSES).doc();
    const classData = { id: docRef.id, name, teacherId, schedule, description, createdAt: new Date().toISOString(), isActive: true };
    await docRef.set(classData);
    res.status(201).json({ success: true, message: 'Class created', data: classData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTIONS.CLASSES).get();
    res.json({ success: true, data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUser, deleteUser, createClass, getAllClasses };
