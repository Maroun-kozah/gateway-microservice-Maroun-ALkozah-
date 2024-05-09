class RequestHandler {

    static sendError(res, error) {
      const statusCode = error.statusCode || 500;
      const errorDetails = {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
      res.status(statusCode).json(errorDetails);
    }
  
    static sendSuccess(res, data, message) {
      const response = {
        success: true,
        message: message || "Success",
        data: data
      };
      res.status(200).json(response);
    }
  
  }
  
  module.exports = RequestHandler;
  