const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token JWT dans les headers
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    // Vérifier le format "Bearer <token>"
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Format de token invalide. Utilisez: Bearer <token>'
      });
    }

    const token = tokenParts[1];

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-change-in-production');

    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
      username: decoded.username,
      role: decoded.role,
      nodeId: decoded.nodeId
    };

    // Passer au middleware suivant
    next();

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

    logger.error('Erreur dans le middleware d\'authentification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

/**
 * Middleware pour vérifier les rôles
 * @param {string|Array} allowedRoles - Rôle(s) autorisé(s)
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

/**
 * Middleware optionnel d'authentification
 * N'échoue pas si le token est absent, mais l'ajoute à req.user s'il est présent et valide
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      req.user = null;
      return next();
    }

    const token = tokenParts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-change-in-production');

    req.user = {
      username: decoded.username,
      role: decoded.role,
      nodeId: decoded.nodeId
    };

    next();

  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur authentifié
    req.user = null;
    next();
  }
};

module.exports = {
  authMiddleware,
  requireRole,
  optionalAuth
};

