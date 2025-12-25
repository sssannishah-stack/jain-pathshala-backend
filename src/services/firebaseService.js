// src/services/firebaseService.js
const { db, FieldValue, collections } = require('../config/firebase');
const { formatDate } = require('../utils/helpers');
const { APPROVAL_STATUS } = require('../utils/constants');

class FirebaseService {
  // ==================== USER OPERATIONS ====================
  
  async getUserById(userId) {
    const doc = await collections.users.doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
  
  async getUsersByRole(role) {
    const snapshot = await collections.users.where('role', '==', role).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async updateUser(userId, data) {
    await collections.users.doc(userId).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    });
    return this.getUserById(userId);
  }
  
  async addMemberToUser(userId, member) {
    await collections.users.doc(userId).update({
      members: FieldValue.arrayUnion(member),
      updatedAt: FieldValue.serverTimestamp()
    });
    return this.getUserById(userId);
  }
  
  async removeMemberFromUser(userId, memberId) {
    const user = await this.getUserById(userId);
    if (!user) return null;
    
    const updatedMembers = user.members.filter(m => m.id !== memberId);
    await collections.users.doc(userId).update({
      members: updatedMembers,
      updatedAt: FieldValue.serverTimestamp()
    });
    return this.getUserById(userId);
  }
  
  // ==================== ATTENDANCE OPERATIONS ====================
  
  async createAttendance(data) {
    const docRef = await collections.attendance.add({
      ...data,
      status: APPROVAL_STATUS.PENDING,
      createdAt: FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...data };
  }
  
  async getAttendanceById(id) {
    const doc = await collections.attendance.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
  
  async getAttendanceByMember(memberId, options = {}) {
    let query = collections.attendance.where('memberId', '==', memberId);
    
    if (options.status) {
      query = query.where('status', '==', options.status);
    }
    
    if (options.startDate && options.endDate) {
      query = query.where('date', '>=', options.startDate)
                   .where('date', '<=', options.endDate);
    }
    
    query = query.orderBy('date', 'desc');
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async getTodayAttendance(memberId) {
    const today = formatDate();
    const snapshot = await collections.attendance
      .where('memberId', '==', memberId)
      .where('date', '==', today)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  
  async getPendingAttendance() {
    const snapshot = await collections.attendance
      .where('status', '==', APPROVAL_STATUS.PENDING)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async updateAttendanceStatus(id, status) {
    const updateData = {
      status,
      updatedAt: FieldValue.serverTimestamp()
    };
    
    if (status === APPROVAL_STATUS.APPROVED) {
      updateData.approvedAt = FieldValue.serverTimestamp();
    } else if (status === APPROVAL_STATUS.REJECTED) {
      updateData.rejectedAt = FieldValue.serverTimestamp();
    }
    
    await collections.attendance.doc(id).update(updateData);
    return this.getAttendanceById(id);
  }
  
  async deleteAttendance(id) {
    await collections.attendance.doc(id).delete();
    return { id, deleted: true };
  }
  
  // ==================== GATHA OPERATIONS ====================
  
  async createGatha(data) {
    const docRef = await collections.gatha.add({
      ...data,
      status: APPROVAL_STATUS.PENDING,
      createdAt: FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...data };
  }
  
  async getGathaById(id) {
    const doc = await collections.gatha.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
  
  async getGathaByMember(memberId, options = {}) {
    let query = collections.gatha.where('memberId', '==', memberId);
    
    if (options.status) {
      query = query.where('status', '==', options.status);
    }
    
    if (options.type) {
      query = query.where('type', '==', options.type);
    }
    
    if (options.startDate && options.endDate) {
      query = query.where('date', '>=', options.startDate)
                   .where('date', '<=', options.endDate);
    }
    
    query = query.orderBy('date', 'desc');
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async getPendingGatha() {
    const snapshot = await collections.gatha
      .where('status', '==', APPROVAL_STATUS.PENDING)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async updateGathaStatus(id, status) {
    const updateData = {
      status,
      updatedAt: FieldValue.serverTimestamp()
    };
    
    if (status === APPROVAL_STATUS.APPROVED) {
      updateData.approvedAt = FieldValue.serverTimestamp();
    } else if (status === APPROVAL_STATUS.REJECTED) {
      updateData.rejectedAt = FieldValue.serverTimestamp();
    }
    
    await collections.gatha.doc(id).update(updateData);
    return this.getGathaById(id);
  }
  
  async deleteGatha(id) {
    await collections.gatha.doc(id).delete();
    return { id, deleted: true };
  }
  
  // ==================== STATS & REPORTS ====================
  
  async getMemberStats(memberId, year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    // Get attendance
    const attendance = await this.getAttendanceByMember(memberId, {
      status: APPROVAL_STATUS.APPROVED,
      startDate,
      endDate
    });
    
    // Get gatha
    const gatha = await this.getGathaByMember(memberId, {
      status: APPROVAL_STATUS.APPROVED,
      startDate,
      endDate
    });
    
    // Calculate stats
    const newGatha = gatha.filter(g => g.type === 'new');
    const revisionGatha = gatha.filter(g => g.type === 'revision');
    
    return {
      attendance: {
        total: attendance.length,
        records: attendance
      },
      gatha: {
        total: gatha.length,
        new: {
          count: newGatha.length,
          totalGatha: newGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0)
        },
        revision: {
          count: revisionGatha.length,
          totalGatha: revisionGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0)
        },
        records: gatha
      }
    };
  }
  
  async getAllMemberStats(memberId) {
    // Get all attendance
    const attendance = await this.getAttendanceByMember(memberId, {
      status: APPROVAL_STATUS.APPROVED
    });
    
    // Get all gatha
    const gatha = await this.getGathaByMember(memberId, {
      status: APPROVAL_STATUS.APPROVED
    });
    
    const newGatha = gatha.filter(g => g.type === 'new');
    const revisionGatha = gatha.filter(g => g.type === 'revision');
    
    return {
      totalAttendance: attendance.length,
      totalGatha: gatha.length,
      newGathaCount: newGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0),
      revisionGathaCount: revisionGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0)
    };
  }
  
  // ==================== BULK OPERATIONS ====================
  
  async approveAllPending(type) {
    const collection = type === 'attendance' ? collections.attendance : collections.gatha;
    const snapshot = await collection
      .where('status', '==', APPROVAL_STATUS.PENDING)
      .get();
    
    const batch = db.batch();
    const updateData = {
      status: APPROVAL_STATUS.APPROVED,
      approvedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, updateData);
    });
    
    await batch.commit();
    return { count: snapshot.docs.length };
  }
  
  async rejectAllPending(type) {
    const collection = type === 'attendance' ? collections.attendance : collections.gatha;
    const snapshot = await collection
      .where('status', '==', APPROVAL_STATUS.PENDING)
      .get();
    
    const batch = db.batch();
    const updateData = {
      status: APPROVAL_STATUS.REJECTED,
      rejectedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, updateData);
    });
    
    await batch.commit();
    return { count: snapshot.docs.length };
  }
}

module.exports = new FirebaseService();
