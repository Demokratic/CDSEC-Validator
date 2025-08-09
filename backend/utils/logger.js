const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Créer le répertoire de logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'cdsec-validator',
    nodeId: process.env.VALIDATOR_NODE_ID || 'unknown'
  },
  transports: [
    // Écriture dans un fichier pour les erreurs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Écriture dans un fichier pour tous les logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// En développement, afficher aussi dans la console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Fonction pour logger les validations
logger.logValidation = (blockId, isValid, details) => {
  logger.info('Validation de bloc', {
    type: 'validation',
    blockId,
    isValid,
    details,
    timestamp: new Date().toISOString()
  });
};

// Fonction pour logger les anomalies
logger.logAnomaly = (type, description, data) => {
  logger.warn('Anomalie détectée', {
    type: 'anomaly',
    anomalyType: type,
    description,
    data,
    timestamp: new Date().toISOString()
  });
};

// Fonction pour logger les erreurs de validation
logger.logValidationError = (blockId, error) => {
  logger.error('Erreur de validation', {
    type: 'validation_error',
    blockId,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

module.exports = logger;

