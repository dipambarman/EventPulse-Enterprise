const prisma = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const logAction = async (userId, action, entity, entityId, details) => {
  try {
    const id = uuidv4();
    await prisma.auditLog.create({
      data: {
        id,
        user_id: userId || null,
        action,
        entity: entity || null,
        entity_id: entityId || null,
        details: details ? JSON.stringify(details) : null
      }
    });
  } catch (err) {
    console.error('[AuditService] Failed to write audit log:', err.message);
  }
};

module.exports = { logAction };
