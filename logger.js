const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.json(),
  // silent during automated tests so `npm test` doesn't litter the repo with log files
  silent: process.env.NODE_ENV === 'test',
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;