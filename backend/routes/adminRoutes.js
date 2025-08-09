const express = require('express');
const { body, validationResult } = require('express-validator');
const database = require('../services/database');
const validatorService = require('../services/validatorService');
const crypto = require('../utils/crypto');
const logger = require('../utils/logger');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Appliquer le middleware d'authentification et de rôle admin
router.use(authMiddleware);
router.use(requireRole('admin'));

/**
 * @route GET /api/admin/dashboard
 * @desc Récupérer les données du tableau de bord admin
 * @access Private (Admin only)
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Statistiques générales
    const stats = await database.getValidationStats();
    
    // Métriques de performance récentes
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const performanceMetrics = await database.getAllQuery(`
      SELECT metric_type, AVG(metric_value) as avg_value, COUNT(*) as count
      FROM performance_metrics 
      WHERE recorded_at > ?
      GROUP BY metric_type
    `, [last24h]);

    // Anomalies par type
    const anomaliesByType = await database.getAllQuery(`
      SELECT anomaly_type, COUNT(*) as count, 
             SUM(CASE WHEN resolved = 1 THEN 1 ELSE 0 END) as resolved_count
      FROM anomalies 
      GROUP BY anomaly_type
    `);

    // Activité récente
    const recentActivity = await database.getAllQuery(`
      SELECT 'validation' as type, validation_timestamp as timestamp, is_valid as status, id as block_id
      FROM validated_blocks 
      WHERE validation_timestamp > ?
      UNION ALL
      SELECT 'anomaly' as type, detected_at as timestamp, 'detected' as status, block_id
      FROM anomalies 
      WHERE detected_at > ?
      ORDER BY timestamp DESC
      LIMIT 20
    `, [last24h, last24h]);

    // Statut du validateur
    const validatorStatus = await validatorService.getValidatorStatus();

    const dashboard = {
      statistics: stats,
      performance: performanceMetrics.reduce((acc, metric) => {
        acc[metric.metric_type] = {
          average: metric.avg_value,
          count: metric.count
        };
        return acc;
      }, {}),
      anomalies: anomaliesByType,
      recentActivity,
      validatorStatus,
      systemInfo: {
        nodeId: process.env.VALIDATOR_NODE_ID || 'validator-node-001',
        organization: process.env.VALIDATOR_ORGANIZATION || 'Association-Citoyenne-001',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du tableau de bord:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau de bord'
    });
  }
});

/**
 * @route POST /api/admin/generate-keys
 * @desc Générer une nouvelle paire de clés Ed25519
 * @access Private (Admin only)
 */
router.post('/generate-keys', async (req, res) => {
  try {
    const keyPair = crypto.generateKeyPair();
    
    logger.info('Nouvelle paire de clés Ed25519 générée par l\'admin');

    res.json({
      success: true,
      message: 'Nouvelle paire de clés générée',
      data: {
        publicKey: keyPair.publicKey,
        secretKey: keyPair.secretKey,
        warning: 'Sauvegardez ces clés de manière sécurisée. La clé privée ne sera plus accessible après cette réponse.'
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la génération des clés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des clés'
    });
  }
});

/**
 * @route POST /api/admin/test-validation
 * @desc Tester la validation avec des données de test
 * @access Private (Admin only)
 */
router.post('/test-validation', async (req, res) => {
  try {
    // Créer un bloc de test
    const testData = {
      type: 'test',
      message: 'Bloc de test généré par l\'admin',
      timestamp: new Date().toISOString(),
      testId: require('crypto').randomUUID()
    };

    // Créer un bloc signé
    const testBlock = crypto.createSignedBlock(testData);
    
    // Valider le bloc
    const validationResult = await validatorService.validateBlock(testBlock);

    logger.info('Test de validation effectué par l\'admin', { testBlock, validationResult });

    res.json({
      success: true,
      message: 'Test de validation effectué',
      data: {
        testBlock,
        validationResult
      }
    });

  } catch (error) {
    logger.error('Erreur lors du test de validation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test de validation'
    });
  }
});

/**
 * @route POST /api/admin/force-validation
 * @desc Forcer une validation manuelle
 * @access Private (Admin only)
 */
router.post('/force-validation', async (req, res) => {
  try {
    await validatorService.forceValidation();
    
    logger.info('Validation manuelle forcée par l\'admin');

    res.json({
      success: true,
      message: 'Validation manuelle démarrée'
    });

  } catch (error) {
    logger.error('Erreur lors de la validation forcée:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la validation forcée'
    });
  }
});

/**
 * @route GET /api/admin/logs
 * @desc Récupérer les logs récents
 * @access Private (Admin only)
 */
router.get('/logs', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logFile = path.join(__dirname, '../logs/combined.log');
    const lines = parseInt(req.query.lines) || 100;

    if (!fs.existsSync(logFile)) {
      return res.json({
        success: true,
        data: {
          logs: [],
          message: 'Fichier de log non trouvé'
        }
      });
    }

    // Lire les dernières lignes du fichier de log
    const logContent = fs.readFileSync(logFile, 'utf8');
    const logLines = logContent.split('\n').filter(line => line.trim());
    const recentLogs = logLines.slice(-lines).reverse();

    // Parser les logs JSON
    const parsedLogs = recentLogs.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return { message: line, level: 'info', timestamp: new Date().toISOString() };
      }
    });

    res.json({
      success: true,
      data: {
        logs: parsedLogs,
        totalLines: logLines.length
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logs'
    });
  }
});

/**
 * @route DELETE /api/admin/anomalies/:id
 * @desc Supprimer une anomalie
 * @access Private (Admin only)
 */
router.delete('/anomalies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.runQuery('DELETE FROM anomalies WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anomalie non trouvée'
      });
    }

    logger.info(`Anomalie ${id} supprimée par l'admin`);

    res.json({
      success: true,
      message: 'Anomalie supprimée'
    });

  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'anomalie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'anomalie'
    });
  }
});

/**
 * @route POST /api/admin/cleanup
 * @desc Nettoyer les anciennes données
 * @access Private (Admin only)
 */
router.post('/cleanup', [
  body('days').isInt({ min: 1, max: 365 }).withMessage('Nombre de jours invalide (1-365)')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { days } = req.body;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Supprimer les anciennes métriques de performance
    const metricsResult = await database.runQuery(
      'DELETE FROM performance_metrics WHERE recorded_at < ?',
      [cutoffDate]
    );

    // Supprimer les anciennes anomalies résolues
    const anomaliesResult = await database.runQuery(
      'DELETE FROM anomalies WHERE resolved = 1 AND resolved_at < ?',
      [cutoffDate]
    );

    // Supprimer les anciennes validations de chaîne
    const chainValidationsResult = await database.runQuery(
      'DELETE FROM chain_validations WHERE validation_timestamp < ?',
      [cutoffDate]
    );

    logger.info(`Nettoyage effectué par l'admin: ${metricsResult.changes} métriques, ${anomaliesResult.changes} anomalies, ${chainValidationsResult.changes} validations de chaîne supprimées`);

    res.json({
      success: true,
      message: 'Nettoyage effectué',
      data: {
        deletedMetrics: metricsResult.changes,
        deletedAnomalies: anomaliesResult.changes,
        deletedChainValidations: chainValidationsResult.changes,
        cutoffDate
      }
    });

  } catch (error) {
    logger.error('Erreur lors du nettoyage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du nettoyage'
    });
  }
});

/**
 * @route GET /api/admin/export
 * @desc Exporter les données de validation
 * @access Private (Admin only)
 */
router.get('/export', async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Récupérer les données
    const validatedBlocks = await database.getAllQuery(
      'SELECT * FROM validated_blocks WHERE validation_timestamp > ? ORDER BY validation_timestamp DESC',
      [since]
    );

    const anomalies = await database.getAllQuery(
      'SELECT * FROM anomalies WHERE detected_at > ? ORDER BY detected_at DESC',
      [since]
    );

    const chainValidations = await database.getAllQuery(
      'SELECT * FROM chain_validations WHERE validation_timestamp > ? ORDER BY validation_timestamp DESC',
      [since]
    );

    const exportData = {
      exportedAt: new Date().toISOString(),
      nodeId: process.env.VALIDATOR_NODE_ID || 'validator-node-001',
      organization: process.env.VALIDATOR_ORGANIZATION || 'Association-Citoyenne-001',
      period: {
        since,
        days
      },
      data: {
        validatedBlocks: validatedBlocks.map(block => ({
          ...block,
          data: block.data ? JSON.parse(block.data) : null
        })),
        anomalies: anomalies.map(anomaly => ({
          ...anomaly,
          data: anomaly.data ? JSON.parse(anomaly.data) : null
        })),
        chainValidations: chainValidations.map(validation => ({
          ...validation,
          validation_details: validation.validation_details ? JSON.parse(validation.validation_details) : null
        }))
      }
    };

    if (format === 'csv') {
      // TODO: Implémenter l'export CSV si nécessaire
      return res.status(400).json({
        success: false,
        message: 'Format CSV non encore implémenté'
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="cdsec-validator-export-${new Date().toISOString().split('T')[0]}.json"`);
    
    res.json(exportData);

  } catch (error) {
    logger.error('Erreur lors de l\'export:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export'
    });
  }
});

module.exports = router;

