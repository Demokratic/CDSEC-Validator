const express = require('express');
const router = express.Router();
const monitoringService = require('../services/monitoringService');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

/**
 * @route GET /api/monitoring/health
 * @desc Vérification de l'état de santé du système
 * @access Public
 */
router.get('/health', async (req, res) => {
  try {
    const health = await monitoringService.checkHealth();
    
    // Retourner le code de statut approprié
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'warning' ? 200 : 503;
    
    res.status(statusCode).json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Erreur lors de la vérification de santé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de santé',
      error: error.message
    });
  }
});

/**
 * @route GET /api/monitoring/metrics
 * @desc Obtenir toutes les métriques du système
 * @access Private (Admin)
 */
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const metrics = await monitoringService.getAllMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des métriques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des métriques',
      error: error.message
    });
  }
});

/**
 * @route GET /api/monitoring/metrics/system
 * @desc Obtenir les métriques système
 * @access Private (Admin)
 */
router.get('/metrics/system', authMiddleware, async (req, res) => {
  try {
    const systemMetrics = await monitoringService.collectSystemMetrics();
    
    res.json({
      success: true,
      data: systemMetrics
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des métriques système:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des métriques système',
      error: error.message
    });
  }
});

/**
 * @route GET /api/monitoring/metrics/validation
 * @desc Obtenir les métriques de validation
 * @access Private (Admin)
 */
router.get('/metrics/validation', authMiddleware, async (req, res) => {
  try {
    const validationMetrics = await monitoringService.collectValidationMetrics();
    
    res.json({
      success: true,
      data: validationMetrics
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des métriques de validation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des métriques de validation',
      error: error.message
    });
  }
});

/**
 * @route GET /api/monitoring/export
 * @desc Exporter toutes les métriques au format JSON
 * @access Private (Admin)
 */
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const exportData = await monitoringService.exportMetrics();
    
    // Définir les en-têtes pour le téléchargement
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cdsec-validator-metrics-${timestamp}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(exportData);
  } catch (error) {
    logger.error('Erreur lors de l\'export des métriques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des métriques',
      error: error.message
    });
  }
});

/**
 * @route POST /api/monitoring/cleanup
 * @desc Nettoyer les anciennes données de monitoring
 * @access Private (Admin)
 */
router.post('/cleanup', authMiddleware, async (req, res) => {
  try {
    await monitoringService.cleanup();
    
    res.json({
      success: true,
      message: 'Nettoyage des données de monitoring terminé'
    });
  } catch (error) {
    logger.error('Erreur lors du nettoyage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du nettoyage des données',
      error: error.message
    });
  }
});

/**
 * @route POST /api/monitoring/error
 * @desc Enregistrer une erreur dans le monitoring
 * @access Private
 */
router.post('/error', authMiddleware, async (req, res) => {
  try {
    const { error, context } = req.body;
    
    if (!error || !error.message) {
      return res.status(400).json({
        success: false,
        message: 'Données d\'erreur invalides'
      });
    }
    
    monitoringService.logError(error, context);
    
    res.json({
      success: true,
      message: 'Erreur enregistrée dans le monitoring'
    });
  } catch (error) {
    logger.error('Erreur lors de l\'enregistrement de l\'erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement',
      error: error.message
    });
  }
});

/**
 * @route GET /api/monitoring/status
 * @desc Obtenir un résumé rapide du statut
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const health = await monitoringService.checkHealth();
    const validationMetrics = await monitoringService.collectValidationMetrics();
    
    const status = {
      status: health.status,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      validations: {
        total: validationMetrics.total_validations || 0,
        success_rate: validationMetrics.success_rate || 0,
        recent_24h: validationMetrics.recent_validations_24h || 0
      },
      anomalies: {
        total: validationMetrics.total_anomalies || 0,
        unresolved: (validationMetrics.total_anomalies || 0) - (validationMetrics.resolved_count || 0)
      }
    };
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du statut',
      error: error.message
    });
  }
});

module.exports = router;

