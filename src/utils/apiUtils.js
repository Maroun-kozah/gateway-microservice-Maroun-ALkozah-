const axios = require("axios");
const AuditTrail = require("../models/audit-trail.model");

exports.sendAxiosRequest = async (url, method, authorization, body, query) => {
  const axiosConfig = {
    method: method,
    url: url,
    headers: authorization ? { Authorization: authorization } : {},
    data: body || undefined,
    params: query || undefined,
  };

  try {
    const response = await axios(axiosConfig);
    return response;
  } catch (err) {
    // More detailed error handling
    console.error('Error during external API call:', err);
    throw {
      message: err.response?.data?.message || 'Unknown error',
      statusCode: err.response?.status || 500,
    };
  }
};

exports.insertAuditTrail = async (req, data, statusCode, microservice) => {
  try {
    const auditTrail = new AuditTrail({
      timestamp: new Date(),
      microservice: microservice,
      url: req.url,
      method: req.method,
      statusCode: statusCode,
      userId: req.user?.id || "public",
      userAgent: req.headers["user-agent"],
      success: statusCode >= 200 && statusCode < 300,
      headers: req.headers,
      result: data,
      params: req.params,
      body: req.body,
    });

    await auditTrail.save();
    console.log('Audit trail successfully logged');
  } catch (error) {
    console.error('Error saving audit trail:', error);
  }
};
