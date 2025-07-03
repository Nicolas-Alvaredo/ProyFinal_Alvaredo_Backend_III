import winston from 'winston';

// Orden de niveles personalizados
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'cyan',
    debug: 'green'
  }
};

// Formato de los logs
const logFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
);

// Logger principal
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Para la consola
    new winston.transports.File({
      filename: './logs/errors.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: './logs/combined.log'
    })
  ]
});

winston.addColors(customLevels.colors);

export default logger;
