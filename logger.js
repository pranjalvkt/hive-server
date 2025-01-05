// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',  // Log level (info, warn, error)
  format: winston.format.combine(
    winston.format.colorize(),  // Colors for logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Timestamp format
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),  // Log to the console
    new winston.transports.File({ filename: 'logs/app.log' }),  // Optionally log to a file
  ],
});

module.exports = logger;