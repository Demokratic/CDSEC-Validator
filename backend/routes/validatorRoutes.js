const express = require('express');
const { body, validationResult } = require('express-validator');
const validatorService = require('../services/validatorService');
const database = require('../services/database');
const crypto = require('../utils/crypto');
const logger = require('../utils/logger');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

/**
 * @route GET /api/validator/status
 * @desc Obtenir le statut du validateur
 * @access Private
 */
router.get('/status', async (req, res) => {
  try {
    const status = await validatorService.getValidatorStatus();
    
    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du statut'
    });
  }
});

/**
 * @route POST /api/validator/validate
 * @desc Forcer une validation manuelle
 * @access Private
 */
router.post('/validate', async (req, res) => {
  try {
    await validatorService.forceValidation();
    
    res.json({
      success: true,
      message: 'Validation manuelle démarrée'
    });

  } catch (error) {
    logger.error('Erreur lors de la validation manuelle:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la validation manuelle'
    });
  }
});

/**
 * @route POST /api/validator/validate-block
 * @desc Valider un bloc spécifique
 * @access Private
 */
router.post('/validate-block', [
  body('block').isObject().withMessage('Bloc requis'),
  body('block.id').notEmpty().withMessage('ID du bloc requis'),
  body('block.hash').notEmpty().withMessage('Hash du bloc requis'),
  body('block.signature').notEmpty().withMessage('Signature du bloc requise'),
  body('block.publicKey').notEmpty().withMessage('Clé publique requise')
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

    const { block } = req.body;
    
    // Valider le bloc
    const validationResult = await validatorService.validateBlock(block);
    
    res.json({
      success: true,
      message: 'Bloc validé',
      data: validationResult
    });

  } catch (error) {
    logger.error('Erreur lors de la validation du bloc:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation du bloc'
    });
  }
});

/**
 * @route POST /api/validator/validate-chain
 * @desc Valider une chaîne de blocs
 * @access Private
 */
router.post('/validate-chain', [
  body('blocks').isArray().withMessage('Tableau de blocs requis'),
  body('blocks').isLength({ min: 1 }).withMessage('Au moins un bloc requis')
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

    const { blocks } = req.body;
    
    // Valider la chaîne
    const validationResult = await validatorService.validateBlockchain(blocks);
    
    res.json({
      success: true,
      message: 'Chaîne validée',
      data: validationResult
    });

  } catch (error) {
    logger.error('Erreur lors de la validation de la chaîne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation de la chaîne'
    });
  }
});

/**
 * @route GET /api/validator/validated-blocks
 * @desc Récupérer les blocs validés
 * @access Private
 */
router.get('/validated-blocks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100
    const offset = (page - 1) * limit;
    const isValid = req.query.valid !== undefined ? req.query.valid === 'true' : null;

    const blocks = await database.getValidatedBlocks(limit, offset, isValid);
    
    // Compter le total pour la pagination
    const countQuery = isValid !== null 
      ? 'SELECT COUNT(*) as total FROM validated_blocks WHERE is_valid = ?'
      : 'SELECT COUNT(*) as total FROM validated_blocks';
    const countParams = isValid !== null ? [isValid] : [];
    const totalResult = await database.getQuery(countQuery, countParams);
    const total = totalResult.total;

    res.json({
      success: true,
      data: {
        blocks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des blocs validés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des blocs validés'
    });
  }
});

/**
 * @route GET /api/validator/anomalies
 * @desc Récupérer les anomalies détectées
 * @access Private
 */
router.get('/anomalies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100
    const offset = (page - 1) * limit;
    const resolved = req.query.resolved !== undefined ? req.query.resolved === 'true' : null;

    const anomalies = await database.getAnomalies(limit, offset, resolved);
    
    // Compter le total pour la pagination
    const countQuery = resolved !== null 
      ? 'SELECT COUNT(*) as total FROM anomalies WHERE resolved = ?'
      : 'SELECT COUNT(*) as total FROM anomalies';
    const countParams = resolved !== null ? [resolved] : [];
    const totalResult = await database.getQuery(countQuery, countParams);
    const total = totalResult.total;

    res.json({
      success: true,
      data: {
        anomalies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des anomalies:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des anomalies'
    });
  }
});

/**
 * @route PUT /api/validator/anomalies/:id/resolve
 * @desc Marquer une anomalie comme résolue
 * @access Private
 */
router.put('/anomalies/:id/resolve', [
  body('resolution_notes').optional().isString().withMessage('Notes de résolution invalides')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;

    const sql = `
      UPDATE anomalies 
      SET resolved = 1, resolved_at = CURRENT_TIMESTAMP, resolution_notes = ?
      WHERE id = ?
    `;
    
    const result = await database.runQuery(sql, [resolution_notes || null, id]);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anomalie non trouvée'
      });
    }

    logger.info(`Anomalie ${id} marquée comme résolue`);

    res.json({
      success: true,
      message: 'Anomalie marquée comme résolue'
    });

  } catch (error) {
    logger.error('Erreur lors de la résolution de l\'anomalie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la résolution de l\'anomalie'
    });
  }
});

/**
 * @route GET /api/validator/statistics
 * @desc Récupérer les statistiques de validation
 * @access Private
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await database.getValidationStats();
    
    // Ajouter des statistiques supplémentaires
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Blocs validés dans les dernières 24h
    const recent24h = await database.getQuery(
      'SELECT COUNT(*) as count FROM validated_blocks WHERE validation_timestamp > ?',
      [last24h]
    );
    
    // Anomalies détectées dans les dernières 24h
    const anomalies24h = await database.getQuery(
      'SELECT COUNT(*) as count FROM anomalies WHERE detected_at > ?',
      [last24h]
    );

    // Métriques de performance récentes
    const avgValidationTime = await database.getQuery(`
      SELECT AVG(metric_value) as avg_time 
      FROM performance_metrics 
      WHERE metric_type = 'validation_duration' AND recorded_at > ?
    `, [last24h]);

    res.json({
      success: true,
      data: {
        ...stats,
        last24h: {
          blocksValidated: recent24h.count,
          anomaliesDetected: anomalies24h.count,
          avgValidationTime: avgValidationTime.avg_time || 0
        },
        validationRate: stats.totalBlocks > 0 ? (stats.validBlocks / stats.totalBlocks * 100).toFixed(2) : 0,
        anomalyRate: stats.totalBlocks > 0 ? (stats.totalAnomalies / stats.totalBlocks * 100).toFixed(2) : 0
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

/**
 * @route GET /api/validator/performance
 * @desc Récupérer les métriques de performance
 * @access Private
 */
router.get('/performance', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const metrics = await database.getAllQuery(`
      SELECT metric_type, metric_value, metric_unit, recorded_at
      FROM performance_metrics 
      WHERE recorded_at > ?
      ORDER BY recorded_at DESC
    `, [since]);

    // Grouper par type de métrique
    const groupedMetrics = {};
    metrics.forEach(metric => {
      if (!groupedMetrics[metric.metric_type]) {
        groupedMetrics[metric.metric_type] = [];
      }
      groupedMetrics[metric.metric_type].push({
        value: metric.metric_value,
        unit: metric.metric_unit,
        timestamp: metric.recorded_at
      });
    });

    res.json({
      success: true,
      data: {
        timeRange: `${hours}h`,
        metrics: groupedMetrics
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des métriques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des métriques'
    });
  }
});

module.exports = router;

