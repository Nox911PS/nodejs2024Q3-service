export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  logLevel: process.env.LOG_LEVEL || 0,
  logMaxSize: parseInt(process.env.LOG_MAX_SIZE_KB, 10) || 64,
  logDir: process.env.LOG_DIR || 'logs',
  logFile: process.env.LOG_FILE_NAME || 'app.log',
});
