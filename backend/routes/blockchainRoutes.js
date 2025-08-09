const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('../utils/crypto');
const database = require('../services/database');
const logger = require('../utils/logger');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

/**
 * @route POST /api/blockchain/verify-signature
 * @desc Vérifier une signature Ed25519
 * @access Private
 */
router.post('/verify-signature', [
  body('message').notEmpty().withMessage('Message requis'),
  body('signature').notEmpty().withMessage('Signature requise'),
  body('publicKey').notEmpty().withMessage('Clé publique requise')
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

    const { message, signature, publicKey } = req.body;

    // Vérifier la signature
    const isValid = crypto.verifySignature(message, signature, publicKey);

    res.json({
      success: true,
      data: {
        isValid,
        message: isValid ? 'Signature valide' : 'Signature invalide'
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la vérification de signature:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de signature'
    });
  }
});

/**
 * @route POST /api/blockchain/calculate-hash
 * @desc Calculer le hash SHA-256 d'un objet
 * @access Private
 */
router.post('/calculate-hash', [
  body('data').notEmpty().withMessage('Données requises')
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

    const { data } = req.body;

    // Calculer le hash
    const hash = crypto.calculateHash(data);

    res.json({
      success: true,
      data: {
        hash,
        algorithm: 'SHA-256',
        input: data
      }
    });

  } catch (error) {
    logger.error('Erreur lors du calcul de hash:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul de hash'
    });
  }
});

/**
 * @route POST /api/blockchain/verify-block-integrity
 * @desc Vérifier l'intégrité d'un bloc
 * @access Private
 */
router.post('/verify-block-integrity', [
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

    // Vérifier l'intégrité du bloc
    const verification = crypto.verifyBlockIntegrity(block);

    res.json({
      success: true,
      data: verification
    });

  } catch (error) {
    logger.error('Erreur lors de la vérification d\'intégrité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification d\'intégrité'
    });
  }
});

/**
 * @route POST /api/blockchain/verify-chain
 * @desc Vérifier l'intégrité d'une chaîne de blocs
 * @access Private
 */
router.post('/verify-chain', [
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

    // Vérifier la chaîne
    const verification = crypto.verifyBlockchain(blocks);

    res.json({
      success: true,
      data: verification
    });

  } catch (error) {
    logger.error('Erreur lors de la vérification de chaîne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de chaîne'
    });
  }
});

/**
 * @route GET /api/blockchain/chain-validations
 * @desc Récupérer l'historique des validations de chaîne
 * @access Private
 */
router.get('/chain-validations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
    const offset = (page - 1) * limit;

    const validations = await database.getAllQuery(`
      SELECT * FROM chain_validations 
      ORDER BY validation_timestamp DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    // Compter le total pour la pagination
    const totalResult = await database.getQuery('SELECT COUNT(*) as total FROM chain_validations');
    const total = totalResult.total;

    // Parser les détails JSON
    const parsedValidations = validations.map(validation => ({
      ...validation,
      validation_details: validation.validation_details ? JSON.parse(validation.validation_details) : null
    }));

    res.json({
      success: true,
      data: {
        validations: parsedValidations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des validations de chaîne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des validations de chaîne'
    });
  }
});

/**
 * @route GET /api/blockchain/chain-validations/:id
 * @desc Récupérer les détails d'une validation de chaîne
 * @access Private
 */
router.get('/chain-validations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const validation = await database.getQuery(`
      SELECT * FROM chain_validations WHERE validation_id = ?
    `, [id]);

    if (!validation) {
      return res.status(404).json({
        success: false,
        message: 'Validation de chaîne non trouvée'
      });
    }

    // Parser les détails JSON
    const parsedValidation = {
      ...validation,
      validation_details: validation.validation_details ? JSON.parse(validation.validation_details) : null
    };

    res.json({
      success: true,
      data: parsedValidation
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération de la validation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la validation'
    });
  }
});

/**
 * @route GET /api/blockchain/block/:id
 * @desc Récupérer les détails d'un bloc validé
 * @access Private
 */
router.get('/block/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const block = await database.getQuery(`
      SELECT * FROM validated_blocks WHERE id = ?
    `, [id]);

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Bloc non trouvé'
      });
    }

    // Parser les données JSON
    const parsedBlock = {
      ...block,
      data: block.data ? JSON.parse(block.data) : null
    };

    res.json({
      success: true,
      data: parsedBlock
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du bloc:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du bloc'
    });
  }
});

/**
 * @route GET /api/blockchain/integrity-report
 * @desc Générer un rapport d'intégrité complet
 * @access Private
 */
router.get('/integrity-report', async (req, res) => {
  try {
    // Statistiques générales
    const stats = await database.getValidationStats();

    // Anomalies récentes (dernières 24h)
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentAnomalies = await database.getAllQuery(`
      SELECT anomaly_type, COUNT(*) as count 
      FROM anomalies 
      WHERE detected_at > ? 
      GROUP BY anomaly_type
    `, [last24h]);

    // Dernières validations de chaîne
    const recentChainValidations = await database.getAllQuery(`
      SELECT validation_id, is_chain_valid, total_blocks, valid_blocks, invalid_blocks, validation_timestamp
      FROM chain_validations 
      ORDER BY validation_timestamp DESC 
      LIMIT 10
    `);

    // Tendances de validation (derniers 7 jours)
    const last7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const validationTrends = await database.getAllQuery(`
      SELECT 
        DATE(validation_timestamp) as date,
        COUNT(*) as total_validations,
        SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) as valid_count,
        SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) as invalid_count
      FROM validated_blocks 
      WHERE validation_timestamp > ?
      GROUP BY DATE(validation_timestamp)
      ORDER BY date DESC
    `, [last7days]);

    const report = {
      generatedAt: new Date().toISOString(),
      nodeId: process.env.VALIDATOR_NODE_ID || 'validator-node-001',
      organization: process.env.VALIDATOR_ORGANIZATION || 'Association-Citoyenne-001',
      summary: {
        ...stats,
        integrityScore: stats.totalBlocks > 0 ? ((stats.validBlocks / stats.totalBlocks) * 100).toFixed(2) : 100
      },
      recentActivity: {
        anomaliesLast24h: recentAnomalies,
        recentChainValidations,
        validationTrends
      },
      systemHealth: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    };

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    logger.error('Erreur lors de la génération du rapport d\'intégrité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport d\'intégrité'
    });
  }
});

module.exports = router;

