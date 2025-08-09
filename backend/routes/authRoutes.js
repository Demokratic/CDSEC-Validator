const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const database = require('../services/database');
const logger = require('../utils/logger');

const router = express.Router();

// Utilisateur admin par défaut (en production, ceci devrait être dans la base de données)
const DEFAULT_ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123', // À changer en production !
  role: 'admin'
};

/**
 * @route POST /api/auth/login
 * @desc Authentification de l'utilisateur
 * @access Public
 */
router.post('/login', [
  body('username').notEmpty().withMessage('Nom d\'utilisateur requis'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe requis (min 6 caractères)')
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

    const { username, password } = req.body;

    // Vérification simple avec l'admin par défaut
    // En production, ceci devrait interroger une base de données d'utilisateurs
    if (username !== DEFAULT_ADMIN.username) {
      return res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    // En production, le mot de passe devrait être hashé
    const isPasswordValid = password === DEFAULT_ADMIN.password;
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        username: username,
        role: DEFAULT_ADMIN.role,
        nodeId: process.env.VALIDATOR_NODE_ID || 'validator-node-001'
      },
      process.env.JWT_SECRET || 'default-secret-change-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`Connexion réussie pour l'utilisateur: ${username}`);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        username: username,
        role: DEFAULT_ADMIN.role,
        nodeId: process.env.VALIDATOR_NODE_ID || 'validator-node-001'
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route POST /api/auth/verify
 * @desc Vérification du token JWT
 * @access Private
 */
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-change-in-production');

    res.json({
      success: true,
      message: 'Token valide',
      user: {
        username: decoded.username,
        role: decoded.role,
        nodeId: decoded.nodeId
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    logger.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Renouvellement du token JWT
 * @access Private
 */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    // Vérifier le token (même s'il est expiré, on peut le renouveler)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-change-in-production');
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Token expiré, mais on peut le décoder quand même pour le renouveler
        decoded = jwt.decode(token);
      } else {
        throw error;
      }
    }

    // Générer un nouveau token
    const newToken = jwt.sign(
      { 
        username: decoded.username,
        role: decoded.role,
        nodeId: decoded.nodeId
      },
      process.env.JWT_SECRET || 'default-secret-change-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Token renouvelé',
      token: newToken,
      user: {
        username: decoded.username,
        role: decoded.role,
        nodeId: decoded.nodeId
      }
    });

  } catch (error) {
    logger.error('Erreur lors du renouvellement du token:', error);
    res.status(401).json({
      success: false,
      message: 'Impossible de renouveler le token'
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Obtenir les informations de l'utilisateur connecté
 * @access Private
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-change-in-production');

    res.json({
      success: true,
      user: {
        username: decoded.username,
        role: decoded.role,
        nodeId: decoded.nodeId,
        organization: process.env.VALIDATOR_ORGANIZATION || 'Association-Citoyenne-001'
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    logger.error('Erreur lors de la récupération des informations utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

module.exports = router;

