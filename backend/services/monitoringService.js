const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const database = require('./database');
const logger = require('../utils/logger');

class MonitoringService {
  constructor() {
    this.metrics = {
      systemInfo: {},
      performance: {},
      validation: {},
      errors: []
    };
    this.startTime = Date.now();
  }

  /**
   * Collecte les métriques système
   */
  async collectSystemMetrics() {
    try {
      const cpuUsage = process.cpuUsage();
      const memUsage = process.memoryUsage();
      
      this.metrics.systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        uptime: process.uptime(),
        hostname: os.hostname(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAverage: os.loadavg(),
        cpuCount: os.cpus().length
      };

      this.metrics.performance = {
        cpuUsage: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        memoryUsage: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external,
          arrayBuffers: memUsage.arrayBuffers
        },
        memoryUsagePercent: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2)
      };

      return this.metrics;
    } catch (error) {
      logger.error('Erreur lors de la collecte des métriques système:', error);
      throw error;
    }
  }

  /**
   * Collecte les métriques de validation
   */
  async collectValidationMetrics() {
    try {
      const db = database.getDatabase();
      
      // Statistiques des validations
      const validationStats = await new Promise((resolve, reject) => {
        db.all(`
          SELECT 
            COUNT(*) as total_validations,
            COUNT(CASE WHEN status = 'valid' THEN 1 END) as valid_count,
            COUNT(CASE WHEN status = 'invalid' THEN 1 END) as invalid_count,
            COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count,
            AVG(CASE WHEN validation_time IS NOT NULL THEN validation_time END) as avg_validation_time
          FROM validations
        `, (err, rows) => {
          if (err) reject(err);
          else resolve(rows[0] || {});
        });
      });

      // Statistiques des anomalies
      const anomalyStats = await new Promise((resolve, reject) => {
        db.all(`
          SELECT 
            COUNT(*) as total_anomalies,
            COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count,
            COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_count,
            COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_count,
            COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_count,
            COUNT(CASE WHEN resolved = 1 THEN 1 END) as resolved_count
          FROM anomalies
        `, (err, rows) => {
          if (err) reject(err);
          else resolve(rows[0] || {});
        });
      });

      // Validations récentes (dernières 24h)
      const recentValidations = await new Promise((resolve, reject) => {
        db.all(`
          SELECT COUNT(*) as count
          FROM validations 
          WHERE created_at > datetime('now', '-24 hours')
        `, (err, rows) => {
          if (err) reject(err);
          else resolve(rows[0]?.count || 0);
        });
      });

      this.metrics.validation = {
        ...validationStats,
        ...anomalyStats,
        recent_validations_24h: recentValidations,
        success_rate: validationStats.total_validations > 0 
          ? ((validationStats.valid_count / validationStats.total_validations) * 100).toFixed(2)
          : 0
      };

      return this.metrics.validation;
    } catch (error) {
      logger.error('Erreur lors de la collecte des métriques de validation:', error);
      throw error;
    }
  }

  /**
   * Vérifie l'état de santé du système
   */
  async checkHealth() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {}
    };

    try {
      // Vérifier la base de données
      health.checks.database = await this.checkDatabaseHealth();
      
      // Vérifier l'utilisation mémoire
      health.checks.memory = await this.checkMemoryHealth();
      
      // Vérifier l'espace disque
      health.checks.disk = await this.checkDiskHealth();
      
      // Vérifier la connectivité API CDSEC
      health.checks.cdsecApi = await this.checkCdsecApiHealth();

      // Déterminer le statut global
      const failedChecks = Object.values(health.checks).filter(check => !check.healthy);
      if (failedChecks.length > 0) {
        health.status = failedChecks.some(check => check.critical) ? 'critical' : 'warning';
      }

    } catch (error) {
      health.status = 'error';
      health.error = error.message;
      logger.error('Erreur lors de la vérification de santé:', error);
    }

    return health;
  }

  /**
   * Vérifie la santé de la base de données
   */
  async checkDatabaseHealth() {
    try {
      const db = database.getDatabase();
      
      return new Promise((resolve) => {
        db.get('SELECT 1', (err) => {
          if (err) {
            resolve({
              healthy: false,
              critical: true,
              message: 'Connexion à la base de données échouée',
              error: err.message
            });
          } else {
            resolve({
              healthy: true,
              message: 'Base de données accessible'
            });
          }
        });
      });
    } catch (error) {
      return {
        healthy: false,
        critical: true,
        message: 'Erreur lors de la vérification de la base de données',
        error: error.message
      };
    }
  }

  /**
   * Vérifie l'utilisation mémoire
   */
  async checkMemoryHealth() {
    try {
      const memUsage = process.memoryUsage();
      const usagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      
      return {
        healthy: usagePercent < 90,
        critical: usagePercent > 95,
        message: `Utilisation mémoire: ${usagePercent.toFixed(2)}%`,
        usage: usagePercent
      };
    } catch (error) {
      return {
        healthy: false,
        critical: false,
        message: 'Erreur lors de la vérification mémoire',
        error: error.message
      };
    }
  }

  /**
   * Vérifie l'espace disque
   */
  async checkDiskHealth() {
    try {
      const stats = await fs.stat(process.cwd());
      // Note: fs.stat ne donne pas l'espace disque disponible
      // Pour une vérification complète, il faudrait utiliser un module comme 'check-disk-space'
      
      return {
        healthy: true,
        message: 'Vérification disque basique réussie'
      };
    } catch (error) {
      return {
        healthy: false,
        critical: false,
        message: 'Erreur lors de la vérification disque',
        error: error.message
      };
    }
  }

  /**
   * Vérifie la connectivité avec l'API CDSEC
   */
  async checkCdsecApiHealth() {
    try {
      const cdsecApiUrl = process.env.CDSEC_API_URL || 'http://localhost:8080/api';
      const axios = require('axios');
      
      const response = await axios.get(`${cdsecApiUrl}/health`, {
        timeout: 5000,
        validateStatus: (status) => status < 500
      });
      
      return {
        healthy: response.status < 400,
        message: `API CDSEC accessible (${response.status})`,
        status: response.status
      };
    } catch (error) {
      return {
        healthy: false,
        critical: false,
        message: 'API CDSEC non accessible',
        error: error.message
      };
    }
  }

  /**
   * Enregistre une erreur dans le monitoring
   */
  logError(error, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context
    };

    this.metrics.errors.push(errorEntry);
    
    // Garder seulement les 100 dernières erreurs
    if (this.metrics.errors.length > 100) {
      this.metrics.errors = this.metrics.errors.slice(-100);
    }

    logger.error('Erreur enregistrée dans le monitoring:', errorEntry);
  }

  /**
   * Obtient toutes les métriques
   */
  async getAllMetrics() {
    await this.collectSystemMetrics();
    await this.collectValidationMetrics();
    
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Exporte les métriques au format JSON
   */
  async exportMetrics() {
    const metrics = await this.getAllMetrics();
    const exportData = {
      export_timestamp: new Date().toISOString(),
      node_id: process.env.VALIDATOR_NODE_ID || 'validator-node-001',
      organization: process.env.VALIDATOR_ORGANIZATION || 'Association-Citoyenne-001',
      metrics
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Nettoie les anciennes données de monitoring
   */
  async cleanup() {
    try {
      const db = database.getDatabase();
      
      // Nettoyer les validations anciennes (> 30 jours)
      await new Promise((resolve, reject) => {
        db.run(`
          DELETE FROM validations 
          WHERE created_at < datetime('now', '-30 days')
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Nettoyer les anomalies résolues anciennes (> 7 jours)
      await new Promise((resolve, reject) => {
        db.run(`
          DELETE FROM anomalies 
          WHERE resolved = 1 AND updated_at < datetime('now', '-7 days')
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      logger.info('Nettoyage des données de monitoring terminé');
    } catch (error) {
      logger.error('Erreur lors du nettoyage:', error);
      throw error;
    }
  }
}

module.exports = new MonitoringService();

