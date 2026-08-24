// Logs incoming requests with timestamp
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] [${req.path}] [${timestamp}]`);
  next();
};

module.exports = requestLogger;
