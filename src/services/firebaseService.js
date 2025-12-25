const { db } = require('../config/firebase');

class FirebaseService {
  async create(collection, data, customId = null) {
    const docRef = customId ? db.collection(collection).doc(customId) : db.collection(collection).doc();
    const timestamp = new Date().toISOString();
    const docData = { ...data, id: docRef.id, createdAt: timestamp, updatedAt: timestamp };
    await docRef.set(docData);
    return docData;
  }

  async getById(collection, id) {
    const doc = await db.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async getAll(collection, conditions = [], orderByField = 'createdAt', limit = 100) {
    let query = db.collection(collection);
    conditions.forEach(({ field, operator, value }) => { query = query.where(field, operator, value); });
    if (orderByField) query = query.orderBy(orderByField, 'desc');
    if (limit) query = query.limit(limit);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async update(collection, id, data) {
    const docRef = db.collection(collection).doc(id);
    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    return this.getById(collection, id);
  }

  async delete(collection, id) {
    await db.collection(collection).doc(id).delete();
    return { success: true, message: 'Document deleted' };
  }
}

module.exports = new FirebaseService();
