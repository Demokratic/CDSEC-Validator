const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const crypto = require('crypto');

class CryptoUtils {
  constructor() {
    this.keyPair = null;
  }

  /**
   * Génère une nouvelle paire de clés Ed25519
   * @returns {Object} Paire de clés avec publicKey et secretKey en base64
   */
  generateKeyPair() {
    const keyPair = nacl.sign.keyPair();
    return {
      publicKey: naclUtil.encodeBase64(keyPair.publicKey),
      secretKey: naclUtil.encodeBase64(keyPair.secretKey)
    };
  }

  /**
   * Initialise le validateur avec une paire de clés
   * @param {string} secretKey Clé privée en base64
   * @param {string} publicKey Clé publique en base64
   */
  initializeKeys(secretKey, publicKey) {
    try {
      this.keyPair = {
        publicKey: naclUtil.decodeBase64(publicKey),
        secretKey: naclUtil.decodeBase64(secretKey)
      };
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de l'initialisation des clés: ${error.message}`);
    }
  }

  /**
   * Signe un message avec la clé privée Ed25519
   * @param {string|Object} message Message à signer
   * @returns {string} Signature en base64
   */
  signMessage(message) {
    if (!this.keyPair) {
      throw new Error('Clés non initialisées. Appelez initializeKeys() d\'abord.');
    }

    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      const messageBytes = naclUtil.decodeUTF8(messageString);
      const signature = nacl.sign.detached(messageBytes, this.keyPair.secretKey);
      return naclUtil.encodeBase64(signature);
    } catch (error) {
      throw new Error(`Erreur lors de la signature: ${error.message}`);
    }
  }

  /**
   * Vérifie une signature Ed25519
   * @param {string|Object} message Message original
   * @param {string} signature Signature en base64
   * @param {string} publicKey Clé publique en base64
   * @returns {boolean} True si la signature est valide
   */
  verifySignature(message, signature, publicKey) {
    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      const messageBytes = naclUtil.decodeUTF8(messageString);
      const signatureBytes = naclUtil.decodeBase64(signature);
      const publicKeyBytes = naclUtil.decodeBase64(publicKey);
      
      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
      throw new Error(`Erreur lors de la vérification: ${error.message}`);
    }
  }

  /**
   * Calcule le hash SHA-256 d'un objet ou d'une chaîne
   * @param {string|Object} data Données à hasher
   * @returns {string} Hash en hexadécimal
   */
  calculateHash(data) {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
  }

  /**
   * Vérifie l'intégrité d'un bloc de données
   * @param {Object} block Bloc à vérifier
   * @returns {Object} Résultat de la vérification
   */
  verifyBlockIntegrity(block) {
    try {
      // Vérifier que le bloc contient les champs requis
      const requiredFields = ['id', 'timestamp', 'data', 'hash', 'signature', 'publicKey'];
      const missingFields = requiredFields.filter(field => !block.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        return {
          isValid: false,
          error: `Champs manquants: ${missingFields.join(', ')}`
        };
      }

      // Recalculer le hash du bloc (sans la signature)
      const blockWithoutSignature = { ...block };
      delete blockWithoutSignature.signature;
      const calculatedHash = this.calculateHash(blockWithoutSignature);

      // Vérifier que le hash correspond
      if (calculatedHash !== block.hash) {
        return {
          isValid: false,
          error: 'Hash du bloc invalide',
          expectedHash: calculatedHash,
          actualHash: block.hash
        };
      }

      // Vérifier la signature Ed25519
      const isSignatureValid = this.verifySignature(block.hash, block.signature, block.publicKey);
      
      if (!isSignatureValid) {
        return {
          isValid: false,
          error: 'Signature Ed25519 invalide'
        };
      }

      return {
        isValid: true,
        hash: calculatedHash,
        signatureValid: true
      };

    } catch (error) {
      return {
        isValid: false,
        error: `Erreur lors de la vérification: ${error.message}`
      };
    }
  }

  /**
   * Crée un bloc signé
   * @param {Object} data Données du bloc
   * @returns {Object} Bloc signé avec hash et signature
   */
  createSignedBlock(data) {
    if (!this.keyPair) {
      throw new Error('Clés non initialisées. Appelez initializeKeys() d\'abord.');
    }

    const block = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data: data,
      publicKey: naclUtil.encodeBase64(this.keyPair.publicKey)
    };

    // Calculer le hash
    block.hash = this.calculateHash(block);

    // Signer le hash
    block.signature = this.signMessage(block.hash);

    return block;
  }

  /**
   * Vérifie la chaîne de blocs (vérification de l'ordre et de l'intégrité)
   * @param {Array} blocks Tableau de blocs
   * @returns {Object} Résultat de la vérification de la chaîne
   */
  verifyBlockchain(blocks) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return {
        isValid: false,
        error: 'Chaîne de blocs vide ou invalide'
      };
    }

    const results = [];
    let isChainValid = true;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const verification = this.verifyBlockIntegrity(block);
      
      results.push({
        blockId: block.id,
        index: i,
        ...verification
      });

      if (!verification.isValid) {
        isChainValid = false;
      }

      // Vérifier l'ordre chronologique
      if (i > 0) {
        const previousBlock = blocks[i - 1];
        const currentTimestamp = new Date(block.timestamp).getTime();
        const previousTimestamp = new Date(previousBlock.timestamp).getTime();
        
        if (currentTimestamp < previousTimestamp) {
          results[i].chronologyError = 'Bloc antérieur au précédent';
          isChainValid = false;
        }
      }
    }

    return {
      isValid: isChainValid,
      totalBlocks: blocks.length,
      validBlocks: results.filter(r => r.isValid).length,
      invalidBlocks: results.filter(r => !r.isValid).length,
      results: results
    };
  }
}

module.exports = new CryptoUtils();

