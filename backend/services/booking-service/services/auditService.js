const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const logAction = async (userId, action, entity, entityId, details) => {
  try {
    const id = uuidv4();
    await db.query(
      'INSERT INTO audit_logs (id, user_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)',
      [id, userId || null, action, entity || null, entityId || null, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    console.error('[AuditService] Failed to write audit log:', err.message);
  }
};

module.exports = { logAction };
