// middleware/auditLog.js
const AuditTrail = require('../models/audit-trail.model');

module.exports = function auditLog(req, res, next) {
  res.on('finish', () => { // Ensures we capture the response status
    const auditEntry = new AuditTrail({
      timestamp: new Date(),
      microservice: 'Gateway',
      url: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      userId: req.user ? req.user.id : 'Anonymous',
      userAgent: req.headers['user-agent'],
      success: res.statusCode >= 200 && res.statusCode < 300,
      headers: req.headers,
      params: req.params,
      body: req.body
    });

    auditEntry.save()
      .then(() => console.log('Audit trail saved successfully'))
      .catch(err => console.error('Error saving audit trail:', err));
  });

  next();
};
