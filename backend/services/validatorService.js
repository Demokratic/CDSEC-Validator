const cron = require('node-cron');
const axios = require('axios');
const crypto = require('../utils/crypto');
const database = require('./database');
const logger = require('../utils/logger');

class ValidatorService {
  constructor() {
    this.isRunning = false;
    this.validationInterval = null;
    this.nodeId = process.env.VALIDATOR_NODE_ID || 'validator-node-001';
    this.organization = process.env.VALIDATOR_ORGANIZATION || 'Association-Citoyenne-001';
    this.cdsecApiUrl = process.env.CDSEC_API_URL || 'http://localhost:8080/api';
    this.cdsecApiKey = process.env.CDSEC_API_KEY;
  }

  /**
   * Initialise le service de validation
   */
  async initialize() {
    try {
      // Initialiser les clés Ed25519
      const privateKey = process.env.VALIDATOR_PRIVATE_KEY;
      const publicKey = process.env.VALIDATOR_PUBLIC_KEY;

      if (!privateKey || !publicKey) {
        // Générer de nouvelles clés si elles n'existent pas
        const keyPair = crypto.generateKeyPair();
        logger.warn('Nouvelles clés Ed25519 générées. Sauvegardez-les dans vos variables d\'environnement:');
        logger.warn(`VALIDATOR_PRIVATE_KEY=${keyPair.secretKey}`);
        logger.warn(`VALIDATOR_PUBLIC_KEY=${keyPair.publicKey}`);
        
        crypto.initializeKeys(keyPair.secretKey, keyPair.publicKey);
      } else {
        crypto.initializeKeys(privateKey, publicKey);
      }

      logger.info(`Service de validation initialisé pour le nœud: ${this.nodeId}`);
      logger.info(`Organisation: ${this.organization}`);
      
      return true;
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation du service de validation:', error);
      throw error;
    }
  }

  /**
   * Démarre la validation automatique
   */
  startAutomaticValidation() {
    if (process.env.AUTO_VALIDATION_ENABLED !== 'true') {
      logger.info('Validation automatique désactivée');
      return;
    }

    const interval = parseInt(process.env.AUTO_VALIDATION_INTERVAL) || 300000; // 5 minutes par défaut
    
    // Utiliser node-cron pour une validation périodique
    this.validationInterval = cron.schedule('*/5 * * * *', async () => {
      if (!this.isRunning) {
        await this.performAutomaticValidation();
      }
    }, {
      scheduled: false
    });

    this.validationInterval.start();
    logger.info(`Validation automatique démarrée (intervalle: ${interval}ms)`);
  }

  /**
   * Arrête la validation automatique
   */
  stopAutomaticValidation() {
    if (this.validationInterval) {
      this.validationInterval.stop();
      this.validationInterval = null;
      logger.info('Validation automatique arrêtée');
    }
  }

  /**
   * Effectue une validation automatique
   */
  async performAutomaticValidation() {
    if (this.isRunning) {
      logger.warn('Validation déjà en cours, ignorée');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Début de la validation automatique');

      // Récupérer les nouveaux blocs depuis l'API CDSEC
      const blocks = await this.fetchNewBlocks();
      
      if (blocks.length === 0) {
        logger.info('Aucun nouveau bloc à valider');
        return;
      }

      logger.info(`${blocks.length} nouveaux blocs à valider`);

      // Valider chaque bloc individuellement
      const validationResults = [];
      for (const block of blocks) {
        const result = await this.validateBlock(block);
        validationResults.push(result);
      }

      // Valider la chaîne complète
      const chainValidation = await this.validateBlockchain(blocks);

      // Sauvegarder les résultats
      await this.saveValidationResults(validationResults, chainValidation);

      const duration = Date.now() - startTime;
      logger.info(`Validation automatique terminée en ${duration}ms`);

      // Enregistrer les métriques de performance
      await this.recordPerformanceMetric('validation_duration', duration, 'ms');
      await this.recordPerformanceMetric('blocks_validated', blocks.length, 'count');

    } catch (error) {
      logger.error('Erreur lors de la validation automatique:', error);
      await this.recordAnomaly(null, 'validation_error', error.message, 'high');
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Récupère les nouveaux blocs depuis l'API CDSEC
   */
  async fetchNewBlocks() {
    try {
      const headers = {};
      if (this.cdsecApiKey) {
        headers['Authorization'] = `Bearer ${this.cdsecApiKey}`;
      }

      // Récupérer le timestamp de la dernière validation
      const lastValidation = await database.getQuery(
        'SELECT validation_timestamp FROM validated_blocks ORDER BY validation_timestamp DESC LIMIT 1'
      );

      const since = lastValidation ? lastValidation.validation_timestamp : null;
      const url = `${this.cdsecApiUrl}/blockchain-explorer/reports${since ? `?since=${since}` : ''}`;

      const response = await axios.get(url, { 
        headers,
        timeout: 30000 // 30 secondes
      });

      if (response.data && response.data.status === 'success') {
        return response.data.data || [];
      } else {
        throw new Error('Réponse API invalide');
      }

    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        logger.warn('Impossible de se connecter à l\'API CDSEC - service peut-être indisponible');
        return [];
      }
      throw new Error(`Erreur lors de la récupération des blocs: ${error.message}`);
    }
  }

  /**
   * Valide un bloc individuel
   */
  async validateBlock(block) {
    const startTime = Date.now();
    
    try {
      // Vérifier l'intégrité cryptographique du bloc
      const cryptoValidation = crypto.verifyBlockIntegrity(block);
      
      // Vérifications métier supplémentaires
      const businessValidation = await this.performBusinessValidation(block);
      
      const result = {
        blockId: block.id,
        isValid: cryptoValidation.isValid && businessValidation.isValid,
        cryptoValidation,
        businessValidation,
        validationDuration: Date.now() - startTime,
        validatedBy: this.nodeId,
        validatedAt: new Date().toISOString()
      };

      // Enregistrer les anomalies si le bloc est invalide
      if (!result.isValid) {
        const errors = [];
        if (!cryptoValidation.isValid) {
          errors.push(`Crypto: ${cryptoValidation.error}`);
        }
        if (!businessValidation.isValid) {
          errors.push(`Business: ${businessValidation.error}`);
        }
        
        await this.recordAnomaly(
          block.id, 
          'invalid_block', 
          errors.join('; '), 
          'high',
          { block, validationResult: result }
        );
      }

      // Sauvegarder le résultat de validation
      await database.saveValidatedBlock(block, result, this.nodeId);
      
      logger.logValidation(block.id, result.isValid, result);
      
      return result;

    } catch (error) {
      logger.logValidationError(block.id, error);
      
      const result = {
        blockId: block.id,
        isValid: false,
        error: error.message,
        validationDuration: Date.now() - startTime,
        validatedBy: this.nodeId,
        validatedAt: new Date().toISOString()
      };

      await this.recordAnomaly(block.id, 'validation_error', error.message, 'high');
      
      return result;
    }
  }

  /**
   * Effectue des validations métier spécifiques
   */
  async performBusinessValidation(block) {
    try {
      const validations = [];

      // Vérifier la structure des données
      if (!block.data || typeof block.data !== 'object') {
        validations.push('Données du bloc manquantes ou invalides');
      }

      // Vérifier le timestamp (ne doit pas être dans le futur)
      const blockTime = new Date(block.timestamp).getTime();
      const now = Date.now();
      const maxFutureTime = 5 * 60 * 1000; // 5 minutes de tolérance
      
      if (blockTime > now + maxFutureTime) {
        validations.push('Timestamp du bloc dans le futur');
      }

      // Vérifier que le bloc n'est pas trop ancien (plus de 30 jours)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
      if (now - blockTime > maxAge) {
        validations.push('Bloc trop ancien');
      }

      // Vérifications spécifiques aux données électorales
      if (block.data.type === 'election_report') {
        const reportValidation = this.validateElectionReport(block.data);
        if (!reportValidation.isValid) {
          validations.push(...reportValidation.errors);
        }
      }

      return {
        isValid: validations.length === 0,
        errors: validations,
        validationType: 'business'
      };

    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        validationType: 'business'
      };
    }
  }

  /**
   * Valide un rapport électoral
   */
  validateElectionReport(reportData) {
    const errors = [];

    // Vérifier les champs requis
    const requiredFields = ['reportId', 'bureauId', 'submitterId', 'reportType'];
    for (const field of requiredFields) {
      if (!reportData[field]) {
        errors.push(`Champ requis manquant: ${field}`);
      }
    }

    // Vérifier le type de rapport
    const validReportTypes = ['result', 'anomaly', 'validation'];
    if (reportData.reportType && !validReportTypes.includes(reportData.reportType)) {
      errors.push(`Type de rapport invalide: ${reportData.reportType}`);
    }

    // Vérifier les votes si c'est un rapport de résultat
    if (reportData.reportType === 'result' && reportData.votes) {
      if (!Array.isArray(reportData.votes)) {
        errors.push('Les votes doivent être un tableau');
      } else {
        for (const vote of reportData.votes) {
          if (!vote.partyId || typeof vote.count !== 'number' || vote.count < 0) {
            errors.push('Format de vote invalide');
            break;
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide une chaîne de blocs
   */
  async validateBlockchain(blocks) {
    try {
      const chainValidation = crypto.verifyBlockchain(blocks);
      
      // Sauvegarder le résultat de validation de chaîne
      await database.saveChainValidation(chainValidation, this.nodeId);
      
      // Enregistrer les anomalies de chaîne si nécessaire
      if (!chainValidation.isValid) {
        await this.recordAnomaly(
          null,
          'invalid_blockchain',
          'Chaîne de blocs invalide',
          'critical',
          chainValidation
        );
      }

      return chainValidation;

    } catch (error) {
      logger.error('Erreur lors de la validation de la chaîne:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde les résultats de validation
   */
  async saveValidationResults(blockResults, chainResult) {
    try {
      // Les résultats de blocs individuels sont déjà sauvegardés dans validateBlock()
      // Ici on peut ajouter des traitements supplémentaires si nécessaire
      
      logger.info(`Résultats de validation sauvegardés: ${blockResults.length} blocs, chaîne ${chainResult.isValid ? 'valide' : 'invalide'}`);
      
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des résultats:', error);
      throw error;
    }
  }

  /**
   * Enregistre une anomalie
   */
  async recordAnomaly(blockId, type, description, severity = 'medium', data = null) {
    try {
      await database.saveAnomaly(blockId, type, description, severity, data);
      logger.logAnomaly(type, description, data);
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement de l\'anomalie:', error);
    }
  }

  /**
   * Enregistre une métrique de performance
   */
  async recordPerformanceMetric(type, value, unit = null, additionalData = null) {
    try {
      const sql = `
        INSERT INTO performance_metrics (metric_type, metric_value, metric_unit, additional_data)
        VALUES (?, ?, ?, ?)
      `;
      await database.runQuery(sql, [type, value, unit, JSON.stringify(additionalData)]);
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement de la métrique:', error);
    }
  }

  /**
   * Obtient le statut du validateur
   */
  async getValidatorStatus() {
    try {
      const stats = await database.getValidationStats();
      
      return {
        nodeId: this.nodeId,
        organization: this.organization,
        isRunning: this.isRunning,
        autoValidationEnabled: process.env.AUTO_VALIDATION_ENABLED === 'true',
        lastValidation: stats.lastValidation,
        totalBlocks: stats.totalBlocks,
        validBlocks: stats.validBlocks,
        invalidBlocks: stats.invalidBlocks,
        totalAnomalies: stats.totalAnomalies,
        unresolvedAnomalies: stats.unresolvedAnomalies,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  }

  /**
   * Force une validation manuelle
   */
  async forceValidation() {
    if (this.isRunning) {
      throw new Error('Une validation est déjà en cours');
    }

    logger.info('Validation manuelle forcée');
    await this.performAutomaticValidation();
  }
}

module.exports = new ValidatorService();

