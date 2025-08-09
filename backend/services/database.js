const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/validator.db');
  }

  /**
   * Initialise la base de données et crée les tables
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      // Créer le répertoire data s'il n'existe pas
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Ouvrir la base de données
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          logger.error('Erreur lors de l\'ouverture de la base de données:', err);
          reject(err);
          return;
        }
        logger.info(`Base de données SQLite connectée: ${this.dbPath}`);
      });

      // Créer les tables
      this.createTables()
        .then(() => {
          logger.info('Tables de base de données créées avec succès');
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Crée les tables nécessaires
   */
  async createTables() {
    const tables = [
      // Table des blocs validés
      `CREATE TABLE IF NOT EXISTS validated_blocks (
        id TEXT PRIMARY KEY,
        block_hash TEXT NOT NULL,
        original_hash TEXT NOT NULL,
        signature TEXT NOT NULL,
        public_key TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        data TEXT NOT NULL,
        is_valid BOOLEAN NOT NULL,
        validation_timestamp TEXT NOT NULL,
        validator_node_id TEXT NOT NULL,
        validation_signature TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des anomalies détectées
      `CREATE TABLE IF NOT EXISTS anomalies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_id TEXT,
        anomaly_type TEXT NOT NULL,
        description TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'medium',
        data TEXT,
        detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved BOOLEAN DEFAULT FALSE,
        resolved_at DATETIME,
        resolution_notes TEXT
      )`,

      // Table des validations de chaîne
      `CREATE TABLE IF NOT EXISTS chain_validations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        validation_id TEXT UNIQUE NOT NULL,
        total_blocks INTEGER NOT NULL,
        valid_blocks INTEGER NOT NULL,
        invalid_blocks INTEGER NOT NULL,
        chain_hash TEXT NOT NULL,
        is_chain_valid BOOLEAN NOT NULL,
        validation_timestamp TEXT NOT NULL,
        validator_node_id TEXT NOT NULL,
        validation_details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des nœuds validateurs (pour le réseau P2P)
      `CREATE TABLE IF NOT EXISTS validator_nodes (
        id TEXT PRIMARY KEY,
        organization TEXT NOT NULL,
        public_key TEXT NOT NULL,
        endpoint_url TEXT,
        last_seen DATETIME,
        is_active BOOLEAN DEFAULT TRUE,
        trust_score REAL DEFAULT 1.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des synchronisations
      `CREATE TABLE IF NOT EXISTS synchronizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_node_id TEXT NOT NULL,
        sync_type TEXT NOT NULL,
        blocks_received INTEGER DEFAULT 0,
        blocks_validated INTEGER DEFAULT 0,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        error_message TEXT
      )`,

      // Table des métriques de performance
      `CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric_type TEXT NOT NULL,
        metric_value REAL NOT NULL,
        metric_unit TEXT,
        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        additional_data TEXT
      )`
    ];

    for (const tableSQL of tables) {
      await this.runQuery(tableSQL);
    }

    // Créer les index pour améliorer les performances
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_validated_blocks_timestamp ON validated_blocks(validation_timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_validated_blocks_valid ON validated_blocks(is_valid)',
      'CREATE INDEX IF NOT EXISTS idx_anomalies_type ON anomalies(anomaly_type)',
      'CREATE INDEX IF NOT EXISTS idx_anomalies_detected ON anomalies(detected_at)',
      'CREATE INDEX IF NOT EXISTS idx_chain_validations_timestamp ON chain_validations(validation_timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type, recorded_at)'
    ];

    for (const indexSQL of indexes) {
      await this.runQuery(indexSQL);
    }
  }

  /**
   * Exécute une requête SQL
   */
  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error('Erreur SQL:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Exécute une requête SELECT
   */
  getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          logger.error('Erreur SQL SELECT:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Exécute une requête SELECT ALL
   */
  getAllQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Erreur SQL SELECT ALL:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Sauvegarde un bloc validé
   */
  async saveValidatedBlock(block, validationResult, validatorNodeId) {
    const sql = `
      INSERT INTO validated_blocks 
      (id, block_hash, original_hash, signature, public_key, timestamp, data, 
       is_valid, validation_timestamp, validator_node_id, validation_signature)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      block.id,
      validationResult.hash || block.hash,
      block.hash,
      block.signature,
      block.publicKey,
      block.timestamp,
      JSON.stringify(block.data),
      validationResult.isValid,
      new Date().toISOString(),
      validatorNodeId,
      validationResult.validationSignature || null
    ];

    return this.runQuery(sql, params);
  }

  /**
   * Sauvegarde une anomalie détectée
   */
  async saveAnomaly(blockId, anomalyType, description, severity = 'medium', data = null) {
    const sql = `
      INSERT INTO anomalies (block_id, anomaly_type, description, severity, data)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [blockId, anomalyType, description, severity, JSON.stringify(data)];
    return this.runQuery(sql, params);
  }

  /**
   * Sauvegarde une validation de chaîne
   */
  async saveChainValidation(validationResult, validatorNodeId) {
    const sql = `
      INSERT INTO chain_validations 
      (validation_id, total_blocks, valid_blocks, invalid_blocks, chain_hash, 
       is_chain_valid, validation_timestamp, validator_node_id, validation_details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const validationId = require('crypto').randomUUID();
    const chainHash = require('../utils/crypto').calculateHash(validationResult);
    
    const params = [
      validationId,
      validationResult.totalBlocks,
      validationResult.validBlocks,
      validationResult.invalidBlocks,
      chainHash,
      validationResult.isValid,
      new Date().toISOString(),
      validatorNodeId,
      JSON.stringify(validationResult.results)
    ];

    return this.runQuery(sql, params);
  }

  /**
   * Récupère les blocs validés avec pagination
   */
  async getValidatedBlocks(limit = 50, offset = 0, isValid = null) {
    let sql = `
      SELECT * FROM validated_blocks 
      ${isValid !== null ? 'WHERE is_valid = ?' : ''}
      ORDER BY validation_timestamp DESC 
      LIMIT ? OFFSET ?
    `;
    
    const params = isValid !== null ? [isValid, limit, offset] : [limit, offset];
    return this.getAllQuery(sql, params);
  }

  /**
   * Récupère les anomalies avec pagination
   */
  async getAnomalies(limit = 50, offset = 0, resolved = null) {
    let sql = `
      SELECT * FROM anomalies 
      ${resolved !== null ? 'WHERE resolved = ?' : ''}
      ORDER BY detected_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const params = resolved !== null ? [resolved, limit, offset] : [limit, offset];
    return this.getAllQuery(sql, params);
  }

  /**
   * Récupère les statistiques de validation
   */
  async getValidationStats() {
    const stats = {};
    
    // Nombre total de blocs validés
    const totalBlocks = await this.getQuery('SELECT COUNT(*) as count FROM validated_blocks');
    stats.totalBlocks = totalBlocks.count;
    
    // Nombre de blocs valides
    const validBlocks = await this.getQuery('SELECT COUNT(*) as count FROM validated_blocks WHERE is_valid = 1');
    stats.validBlocks = validBlocks.count;
    
    // Nombre de blocs invalides
    const invalidBlocks = await this.getQuery('SELECT COUNT(*) as count FROM validated_blocks WHERE is_valid = 0');
    stats.invalidBlocks = invalidBlocks.count;
    
    // Nombre d'anomalies
    const totalAnomalies = await this.getQuery('SELECT COUNT(*) as count FROM anomalies');
    stats.totalAnomalies = totalAnomalies.count;
    
    // Anomalies non résolues
    const unresolvedAnomalies = await this.getQuery('SELECT COUNT(*) as count FROM anomalies WHERE resolved = 0');
    stats.unresolvedAnomalies = unresolvedAnomalies.count;
    
    // Dernière validation
    const lastValidation = await this.getQuery('SELECT validation_timestamp FROM validated_blocks ORDER BY validation_timestamp DESC LIMIT 1');
    stats.lastValidation = lastValidation ? lastValidation.validation_timestamp : null;
    
    return stats;
  }

  /**
   * Ferme la connexion à la base de données
   */
  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            logger.error('Erreur lors de la fermeture de la base de données:', err);
          } else {
            logger.info('Base de données fermée');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new DatabaseService();

