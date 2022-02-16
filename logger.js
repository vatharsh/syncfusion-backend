var winston = require('winston');
require('winston-daily-rotate-file');

var transportSuccess = new (winston.transports.DailyRotateFile)({
  filename: 'backend/logs/application-%DATE%.log', //change to "logs/application-%DATE%.log" when deploy
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transportSuccess.on('rotate', function(oldFilename, newFilename) {
  // do something fun
});

const successLogger  = winston.createLogger({
  transports: [
    transportSuccess
  ]
});

var transportError = new (winston.transports.DailyRotateFile)({
  filename: 'backend/logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transportError.on('rotate', function(oldFilename, newFilename) {
  // do something fun
});

const errorLogger  = winston.createLogger({
  transports: [
    transportError
  ]
});

module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger
};
