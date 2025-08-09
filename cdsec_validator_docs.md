# CDSEC Validator Node

![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Docker](https://img.shields.io/badge/docker-supported-blue.svg)

**Système de validation d'intégrité des données électorales citoyennes**

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Concept et architecture](#-concept--un-réseau-de-validateurs-citoyens)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Installation et démarrage](#-installation-et-démarrage)
- [Configuration](#-configuration)
- [Interface d'administration](#-interface-dadministration)
- [Sécurité](#-sécurité)
- [API REST](#-api-rest)
- [Monitoring et observabilité](#-monitoring-et-observabilité)
- [Déploiement](#-déploiement)
- [Structure du projet](#-structure-du-projet)
- [Développement](#-développement)
- [Participation et contribution](#-comment-participer-)
- [Support](#-support)

## 🎯 Vue d'ensemble

CDSEC Validator Node est un projet innovant visant à garantir l'intégrité des données d'une application de surveillance électorale citoyenne (CDSEC) grâce à un réseau de nœuds indépendants, chacun contrôlé par une association différente.

Ce système répond aux enjeux cruciaux de :
- **Transparence démocratique** : Surveillance citoyenne des processus électoraux
- **Décentralisation** : Aucune entité unique ne contrôle la validation
- **Résilience** : Résistance aux tentatives de manipulation ou de censure
- **Auditabilité** : Traçabilité complète des validations

## 🔐 Concept : un réseau de validateurs citoyens

### Principe fondamental

L'idée centrale est de construire un **réseau distribué de nœuds de validation**. Chaque nœud est géré par une association différente, garantissant la décentralisation, la transparence et la résilience du système.

Ce modèle s'inspire des **blockchains publiques**, où plusieurs validateurs s'assurent que personne ne peut falsifier ou contrôler les données à lui seul.

### Architecture distribuée

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Association A │    │   Association B │    │   Association C │
│                 │    │                 │    │                 │
│ CDSEC Validator │◄──►│ CDSEC Validator │◄──►│ CDSEC Validator │
│     Node        │    │     Node        │    │     Node        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │      CDSEC Core         │
                    │   (Données source)      │
                    └─────────────────────────┘
```

### Responsabilités de chaque association partenaire

Chaque association participante :

1. **Héberge** un serveur CDSEC Validator Node sur son infrastructure
2. **Reçoit** les blocs de données via API REST ou réseau P2P
3. **Valide** indépendamment l'intégrité cryptographique des données
4. **Publie** son propre rapport d'intégrité automatisé et transparent
5. **Maintient** un historique complet des validations pour audit

### Avantages du modèle distribué

- **Pas de point de défaillance unique** : Si un nœud tombe, les autres continuent
- **Résistance à la censure** : Impossible de faire taire tous les validateurs
- **Transparence maximale** : Chaque association peut publier ses propres analyses
- **Confiance distribuée** : Aucune autorité centrale ne contrôle les validations

## ✅ Fonctionnalités

### 🔐 Sécurité cryptographique
- **Signature/validation cryptographique** via Ed25519 (courbes elliptiques)
- **Génération automatique** de clés de signature uniques par nœud
- **Vérification d'intégrité** de chaque bloc de données reçu
- **Détection** de tentatives de falsification ou d'altération

### 🖥️ Interface utilisateur moderne
- **Interface d'administration React** complète et intuitive
- **Design responsive** adapté à tous les écrans
- **Thème sombre/clair** pour le confort d'utilisation
- **Tableaux de bord** en temps réel avec graphiques interactifs

### 🤖 Automatisation intelligente
- **Monitoring automatique** de l'intégrité des blocs
- **Mode totalement automatisé** pour une gestion sans intervention
- **Validation périodique** configurable (intervalle personnalisable)
- **Alertes automatiques** en cas d'anomalie détectée

### 🔍 Détection d'anomalies
- **Hash invalides** : Détection de blocs corrompus ou modifiés
- **Tentatives de falsification** : Identification de manipulations
- **Pertes de cohérence** : Vérification de la continuité de la chaîne
- **Système de scoring** pour évaluer la gravité des anomalies

### 🐳 Déploiement simplifié
- **Conteneurisation Docker** prête à déployer
- **Docker Compose** pour orchestration complète
- **Configuration par variables d'environnement**
- **Scripts d'installation** automatisés

### 📊 Monitoring et export
- **Métriques Prometheus** intégrées
- **Tableaux de bord Grafana** pré-configurés
- **Export de données** pour audit et sauvegarde
- **Logs détaillés** avec rotation automatique

### 🌐 Intégration et API
- **API REST complète** pour l'intégration avec d'autres systèmes
- **Webhooks** pour notifications en temps réel
- **Format de données standardisé** compatible JSON
- **Documentation OpenAPI/Swagger** générée automatiquement

## ⚙️ Stack technique

### Backend
- **Node.js 20+** : Runtime JavaScript moderne et performant
- **Express.js** : Framework web minimaliste et flexible
- **SQLite** : Base de données embarquée, sans configuration
- **Ed25519** : Cryptographie à courbes elliptiques de pointe

### Frontend
- **React.js 18+** : Framework UI avec hooks et composants fonctionnels
- **Vite** : Build tool ultra-rapide pour le développement
- **Tailwind CSS** : Framework CSS utility-first
- **shadcn/ui** : Composants UI modernes et accessibles
- **Lucide Icons** : Icônes cohérentes et élégantes

### Sécurité
- **JWT (JSON Web Tokens)** : Authentification stateless
- **Helmet.js** : Protection contre les vulnérabilités web communes
- **CORS** : Configuration fine des origines autorisées
- **Rate limiting** : Protection contre les attaques par force brute
- **Input validation** : Sanitisation stricte des données d'entrée

### DevOps et monitoring
- **Docker & Docker Compose** : Conteneurisation et orchestration
- **Prometheus** : Collecte de métriques système et applicatives
- **Grafana** : Visualisation et tableaux de bord
- **PM2** : Gestionnaire de processus pour la production

### Outils de développement
- **ESLint** : Analyse statique du code JavaScript
- **Prettier** : Formatage automatique du code
- **Jest** : Framework de tests unitaires
- **Supertest** : Tests d'intégration API

## 🚀 Installation et démarrage

### Prérequis système

#### Obligatoires
- **Docker 24.0+** et **Docker Compose 2.0+**
- **Git** pour cloner le repository
- **2 Go RAM minimum** (4 Go recommandés)
- **10 Go d'espace disque** pour les logs et données

#### Pour le développement (optionnel)
- **Node.js 20+** avec npm/pnpm
- **Python 3.8+** pour certains outils de build
- **Éditeur de code** (VS Code recommandé)

### 🚀 Démarrage rapide avec Docker

#### 1. Cloner le projet
```bash
git clone https://github.com/your-org/cdsec-validator.git
cd cdsec-validator
```

#### 2. Configuration initiale
```bash
# Copier le fichier de configuration exemple
cp .env.example .env

# Éditer la configuration (voir section Configuration)
nano .env  # ou votre éditeur préféré
```

#### 3. Démarrer tous les services
```bash
# Démarrage complet (validator + monitoring)
docker-compose up -d

# Vérifier que tous les services sont démarrés
docker-compose ps
```

#### 4. Accéder aux interfaces
- **Interface d'administration** : http://localhost:3001
- **API REST** : http://localhost:3001/api
- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3000

### 🔑 Identifiants par défaut

#### Interface d'administration CDSEC
- **Utilisateur :** `admin`
- **Mot de passe :** `admin123`

#### Grafana (monitoring)
- **Utilisateur :** `admin`
- **Mot de passe :** `admin`

⚠️ **IMPORTANT** : Changez ces identifiants avant la mise en production !

### 🔧 Vérification de l'installation

#### Commandes de diagnostic
```bash
# Vérifier les logs du validateur
docker-compose logs -f validator

# Tester la connectivité API
curl http://localhost:3001/api/validator/status

# Vérifier les métriques
curl http://localhost:3001/api/monitoring/health
```

#### Indicateurs de bon fonctionnement
- Interface web accessible sans erreur
- Status API retourne `{"status": "healthy"}`
- Métriques Prometheus collectées
- Aucune erreur critique dans les logs

## 🔧 Configuration

### Variables d'environnement principales

#### Identité du nœud
| Variable | Description | Défaut | Exemple |
|----------|-------------|---------|---------|
| `VALIDATOR_NODE_ID` | Identifiant unique du nœud | `validator-node-001` | `quadrature-validator-01` |
| `ORGANIZATION` | Nom de votre association | `Association Citoyenne` | `La Quadrature du Net` |
| `CONTACT_EMAIL` | Email de contact | - | `contact@laquadrature.net` |
| `PUBLIC_URL` | URL publique du nœud | `http://localhost:3001` | `https://validator.monasso.org` |

#### Connexion CDSEC
| Variable | Description | Défaut | Notes |
|----------|-------------|---------|-------|
| `CDSEC_API_URL` | URL de l'API CDSEC source | `http://localhost:8080/api` | À configurer selon CDSEC |
| `CDSEC_API_KEY` | Clé API CDSEC (si requis) | - | Optionnel selon la config |
| `CDSEC_POLL_INTERVAL` | Intervalle de polling (ms) | `300000` | 300000 = 5 minutes |

#### Validation automatique
| Variable | Description | Défaut | Recommandation |
|----------|-------------|---------|----------------|
| `AUTO_VALIDATION_ENABLED` | Validation automatique | `true` | Laisser activé |
| `VALIDATION_INTERVAL` | Intervalle validation (ms) | `300000` | 5-15 minutes en prod |
| `MAX_BLOCKS_PER_VALIDATION` | Blocs max par validation | `100` | Adapter selon les resources |
| `VALIDATION_TIMEOUT` | Timeout validation (ms) | `60000` | 60 secondes |

#### Sécurité et authentification
| Variable | Description | Défaut | **OBLIGATOIRE À CHANGER** |
|----------|-------------|---------|---------------------------|
| `JWT_SECRET` | Clé secrète JWT | `your-super-secret-key` | ⚠️ **OUI** |
| `ADMIN_USERNAME` | Nom utilisateur admin | `admin` | ⚠️ **OUI** |
| `ADMIN_PASSWORD` | Mot de passe admin | `admin123` | ⚠️ **OUI** |
| `SESSION_TIMEOUT` | Durée session (ms) | `86400000` | 24h par défaut |

#### Base de données et stockage
| Variable | Description | Défaut | Notes |
|----------|-------------|---------|-------|
| `DB_PATH` | Chemin base de données | `./data/validator.db` | Persisté via volume |
| `BACKUP_ENABLED` | Sauvegarde auto | `true` | Recommandé |
| `BACKUP_INTERVAL` | Intervalle backup (ms) | `43200000` | 12h par défaut |
| `DATA_RETENTION_DAYS` | Rétention données (jours) | `365` | 1 an par défaut |

#### Réseau et performance
| Variable | Description | Défaut | Production |
|----------|-------------|---------|------------|
| `PORT` | Port d'écoute | `3001` | Peut être changé |
| `MAX_CONNECTIONS` | Connexions simultanées | `100` | Adapter selon besoins |
| `RATE_LIMIT_REQUESTS` | Requêtes/min par IP | `100` | Protection DoS |
| `LOG_LEVEL` | Niveau de logs | `info` | `warn` ou `error` en prod |

### Configuration avancée

#### Exemple de fichier .env complet
```bash
# === IDENTITÉ DU NŒUD ===
VALIDATOR_NODE_ID=quadrature-validator-paris-01
ORGANIZATION=La Quadrature du Net
CONTACT_EMAIL=admin@laquadrature.net
PUBLIC_URL=https://cdsec-validator.laquadrature.net

# === CONNEXION CDSEC ===
CDSEC_API_URL=https://api.cdsec.fr/v1
CDSEC_API_KEY=votre-cle-api-si-necessaire
CDSEC_POLL_INTERVAL=600000

# === SÉCURITÉ (À CHANGER ABSOLUMENT) ===
JWT_SECRET=votre-cle-jwt-ultra-secrete-256-bits-minimum
ADMIN_USERNAME=admin_lqdn
ADMIN_PASSWORD=votre-mot-de-passe-complexe-2024!
SESSION_TIMEOUT=43200000

# === VALIDATION ===
AUTO_VALIDATION_ENABLED=true
VALIDATION_INTERVAL=600000
MAX_BLOCKS_PER_VALIDATION=50

# === MONITORING ===
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=votre-password-grafana
```

#### Validation de la configuration
```bash
# Vérifier la configuration avant démarrage
docker-compose config

# Tester les variables d'environnement
docker-compose run --rm validator node -e "console.log(process.env)"
```

## 📊 Interface d'administration

L'interface d'administration est une application web moderne développée en React, offrant une expérience utilisateur intuitive pour la gestion et le monitoring du nœud validateur.

### 🏠 Tableau de bord principal

#### Vue d'ensemble système
- **Statut en temps réel** du service validateur (actif/inactif/erreur)
- **Métriques système** : CPU, mémoire, espace disque, uptime
- **Indicateurs de santé** : Connectivité CDSEC, base de données, services
- **Activité récente** : Dernières validations, erreurs, événements

#### Statistiques de validation
- **Blocs validés** aujourd'hui, cette semaine, ce mois
- **Taux de réussite** des validations (pourcentage)
- **Anomalies détectées** et leur répartition par type
- **Graphiques temporels** de l'activité de validation

#### Alertes et notifications
- **Alertes actives** avec niveau de priorité (critique/warning/info)
- **Historique des alertes** résolvues
- **Configuration des seuils** d'alerte personnalisables

### 🛡️ Section Validateur

#### Contrôle du service
- **Démarrage/Arrêt** du service de validation automatique
- **Validation manuelle** : Déclencher une validation ponctuelle
- **Configuration en temps réel** : Modifier les paramètres sans redémarrage
- **Mode de fonctionnement** : Auto/Manuel/Maintenance

#### Statistiques détaillées
- **Historique complet** des validations avec filtrage par date
- **Détail par bloc** : Hash, timestamp, statut, temps de traitement
- **Métriques de performance** : Temps moyen, débit, erreurs
- **Comparaison** avec d'autres nœuds (si données disponibles)

#### Rapports de validation
- **Export PDF/CSV** des rapports de validation
- **Signature numérique** des rapports pour authentification
- **Partage public** des rapports (URLs publiques)
- **Archive** des rapports précédents

### ⛓️ Exploration de la Blockchain

#### Intégrité de la chaîne
- **Visualisation graphique** de la chaîne de blocs
- **Vérification de continuité** : Détection des blocs manquants
- **Hash de chaque bloc** avec vérification cryptographique
- **Arbre de Merkle** pour vérification d'intégrité globale

#### Historique des validations
- **Chronologie complète** des validations de chaîne
- **Comparaison** avec d'autres nœuds validateurs
- **Détection des divergences** entre validateurs
- **Résolution des conflits** et synchronisation

#### Rapport d'intégrité détaillé
- **Score d'intégrité** global de la blockchain
- **Analyse des anomalies** détectées dans la chaîne
- **Recommandations** pour résoudre les problèmes
- **Certification** de l'intégrité par signature Ed25519

### ⚠️ Gestion des anomalies

#### Liste et classification
- **Filtrage avancé** par type, sévérité, date, statut
- **Types d'anomalies** :
  - Hash invalides ou corrompus
  - Blocs manquants dans la séquence
  - Signatures cryptographiques invalides
  - Incohérences temporelles
  - Tentatives de double-dépense ou manipulation

#### Système de résolution
- **Workflow de résolution** étape par étape
- **Attribution** des anomalies aux responsables
- **Suivi du statut** : Nouveau → En cours → Résolu → Vérifié
- **Commentaires** et historique des actions
- **Escalade automatique** pour les anomalies critiques

#### Analyse et reporting
- **Tendances** d'apparition des anomalies
- **Analyse des causes racines** (RCA)
- **Métriques de résolution** : Temps moyen, taux de résolution
- **Rapports** automatiques pour les parties prenantes

### ⚙️ Paramètres et administration

#### Gestion des clés cryptographiques
- **Génération** de nouvelles paires de clés Ed25519
- **Visualisation** des clés publiques (clés privées jamais affichées)
- **Rotation des clés** avec migration transparente
- **Import/Export** sécurisé des clés
- **Sauvegarde chiffrée** des clés privées

#### Configuration système
- **Paramètres de validation** : Intervalles, timeouts, seuils
- **Configuration réseau** : URLs, ports, certificats
- **Gestion des utilisateurs** : Ajout/suppression d'administrateurs
- **Permissions** et rôles utilisateur (lecture/écriture/admin)

#### Maintenance et données
- **Export complet** des données en format standard
- **Import** de données depuis d'autres nœuds
- **Nettoyage** automatique des anciennes données
- **Sauvegarde/Restauration** de la base de données
- **Migration** vers de nouvelles versions

#### Logs et diagnostic
- **Consultation** des logs système en temps réel
- **Filtrage** par niveau (debug, info, warn, error)
- **Recherche** dans l'historique des logs
- **Téléchargement** des logs pour analyse externe
- **Rotation automatique** et archivage

## 🔒 Sécurité

La sécurité est au cœur du CDSEC Validator Node, avec plusieurs couches de protection pour garantir l'intégrité des données et la résistance aux attaques.

### 🔐 Cryptographie Ed25519

#### Pourquoi Ed25519 ?
- **Performance** : Signature et vérification ultra-rapides
- **Sécurité** : Résistance quantique partielle, courbes elliptiques modernes
- **Compacité** : Clés et signatures de taille réduite (32/64 bytes)
- **Déterminisme** : Pas de dépendance aux générateurs aléatoires

#### Implémentation
- **Génération automatique** de paires de clés uniques par nœud
- **Stockage sécurisé** des clés privées (chiffrement au repos)
- **Signature** de tous les rapports de validation
- **Vérification** croisée entre nœuds validateurs

#### Gestion des clés
```javascript
// Exemple de structure des clés (format conceptuel)
{
  "nodeId": "validator-node-001",
  "keyPair": {
    "publicKey": "A1B2C3...", // 32 bytes, partagée publiquement
    "privateKey": "[ENCRYPTED]", // 32 bytes, chiffrée
    "created": "2024-01-15T10:30:00Z",
    "expires": "2025-01-15T10:30:00Z"
  }
}
```

### 🔑 Authentification et autorisation

#### JSON Web Tokens (JWT)
- **Stateless** : Pas de session serveur, scalabilité maximale
- **Expiration automatique** : Tokens avec durée de vie limitée
- **Refresh tokens** pour renouvellement transparent
- **Claims personnalisés** pour permissions granulaires

#### Middleware de sécurité
```javascript
// Protection des routes sensibles
app.use('/api/admin/*', authMiddleware, adminRoleMiddleware);
app.use('/api/validator/validate', authMiddleware, rateLimitMiddleware);
```

#### Gestion des sessions
- **Timeout configurable** (par défaut 24h)
- **Révocation** instantanée des tokens compromis
- **Audit trail** de toutes les connexions
- **Protection CSRF** avec tokens uniques

### 🛡️ Protection réseau et applicative

#### Headers de sécurité (Helmet.js)
```javascript
// Configuration Helmet pour protection maximale
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true
  }
})
```

#### CORS (Cross-Origin Resource Sharing)
- **Origines autorisées** configurables par environnement
- **Méthodes HTTP** restreintes (GET, POST uniquement pour la plupart)
- **Headers** autorisés strictement contrôlés
- **Credentials** gérés selon les besoins

#### Rate Limiting anti-DDoS
- **100 requêtes/minute** par IP par défaut
- **Escalade progressive** : Délais croissants pour les abus
- **Whitelist IP** pour les nœuds partenaires
- **Logs détaillés** des tentatives de surcharge

### 🔍 Validation et sanitisation

#### Validation stricte des entrées
```javascript
// Exemple de validation Joi
const blockValidationSchema = Joi.object({
  blockId: Joi.string().uuid().required(),
  hash: Joi.string().hex().length(64).required(),
  previousHash: Joi.string().hex().length(64).required(),
  timestamp: Joi.date().iso().required(),
  data: Joi.object().required()
});
```

#### Protection contre les injections
- **Requêtes préparées** SQLite pour éviter SQL injection
- **Échappement HTML** automatique dans les templates
- **Validation JSON Schema** pour toutes les entrées API
- **Limitation de taille** des payloads (max 1MB par requête)

### 🔐 Chiffrement et stockage sécurisé

#### Chiffrement au repos
- **Base de données SQLite** avec chiffrement transparent
- **Clés privées** chiffrées avec AES-256-GCM
- **Fichiers de configuration** sensibles protégés
- **Logs** avec informations sensibles masquées

#### Chiffrement en transit
- **HTTPS obligatoire** en production (TLS 1.3)
- **Certificate pinning** pour connexions critiques
- **Validation des certificats** stricte
- **Perfect Forward Secrecy** pour toutes les connexions

### 🚨 Audit et détection d'intrusion

#### Logging sécurisé
- **Audit trail** complet de toutes les actions sensibles
- **Horodatage cryptographique** des événements
- **Intégrité des logs** garantie par hachage
- **Rotation sécurisée** avec archivage chiffré

#### Détection d'anomalies
- **Patterns de trafic** anormaux (volume, fréquence, origines)
- **Tentatives d'authentification** suspectes
- **Modifications** non autorisées des données
- **Alertes automatiques** avec escalade

### 🛠️ Sécurité opérationnelle

#### Configuration de production
```bash
# Variables critiques pour la sécurité
HTTPS_ONLY=true
SECURE_COOKIES=true
JWT_ALGORITHM=EdDSA  # Utilise Ed25519 pour JWT
PASSWORD_MIN_LENGTH=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000  # 15 minutes
```

#### Mise à jour et maintenance
- **Mise à jour automatique** des dépendances de sécurité
- **Scan de vulnérabilités** avec npm audit / Snyk
- **Images Docker** basées sur Alpine Linux (surface d'attaque minimale)
- **Principe du moindre privilège** : Utilisateur non-root dans les conteneurs

## 📡 API REST

L'API REST du CDSEC Validator Node expose tous les endpoints nécessaires pour l'intégration avec d'autres systèmes, le monitoring externe et l'automatisation.

### 🔗 Base URL et versioning

```
Base URL: http://localhost:3001/api
Version: v1 (incluse dans le path)
Format: JSON exclusivement
Authentification: JWT Bearer Token (sauf endpoints publics)
```

### 🔐 Authentification

#### POST /api/auth/login
Connexion et obtention du token JWT.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "username": "admin",
    "role": "administrator",
    "lastLogin": "2024-01-15T14:30:00Z"
  }
}
```

#### POST /api/auth/verify
Vérification de la validité d'un token.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "username": "admin",
    "role": "administrator"
  },
  "expiresAt": "2024-01-16T14:30:00Z"
}
```

#### POST /api/auth/logout
Révocation du token (logout).

**Response (200):**
```json
{
  "success": true,
  "message": "Token révoqué avec succès"
}
```

### 🛡️ Endpoints Validateur

#### GET /api/validator/status
Statut en temps réel du service validateur.

**Response (200):**
```json
{
  "status": "healthy",
  "nodeId": "validator-node-001",
  "organization": "Association Citoyenne",
  "uptime": 86400000,
  "lastValidation": "2024-01-15T14:25:00Z",
  "autoValidationEnabled": true,
  "connectedToCDSEC": true,
  "systemInfo": {
    "version": "1.0.0",
    "nodeVersion": "20.10.0",
    "platform": "linux",
    "memory": {
      "used": "156MB",
      "total": "2GB"
    }
  }
}
```

#### POST /api/validator/validate
Déclencher une validation manuelle.

**Request (optionnel):**
```json
{
  "blockIds": ["block-123", "block-124"],  // Blocs spécifiques (optionnel)
  "forceRevalidation": false  // Re-valider des blocs déjà validés
}
```

**Response (200):**
```json
{
  "success": true,
  "validationId": "val-456",
  "message": "Validation démarrée",
  "estimatedDuration": 30000,
  "blocksToValidate": 15
}
```

#### GET /api/validator/statistics
Statistiques détaillées du validateur.

**Query Parameters:**
```
?period=7d&groupBy=day&includeDetails=true
```

**Response (200):**
```json
{
  "summary": {
    "totalValidations": 1234,
    "successfulValidations": 1220,
    "failedValidations": 14,
    "successRate": 98.86,
    "averageValidationTime": 2.3,
    "totalBlocksValidated": 5678
  },
  "timeline": [
    {
      "date": "2024-01-15",
      "validations": 45,
      "successful": 44,
      "failed": 1,
      "avgTime": 2.1
    }
  ],
  "anomalies": {
    "total": 14,
    "byType": {
      "invalidHash": 8,
      "missingBlock": 3,
      "timestampError": 2,
      "signatureError": 1
    }
  }
}
```

#### GET /api/validator/anomalies
Liste des anomalies détectées avec filtrage.

**Query Parameters:**
```
?status=open&severity=high&limit=50&offset=0&sortBy=createdAt&order=desc
```

**Response (200):**
```json
{
  "anomalies": [
    {
      "id": "anomaly-789",
      "type": "invalidHash",
      "severity": "high",
      "blockId": "block-123",
      "expectedHash": "abc123...",
      "actualHash": "def456...",
      "detectedAt": "2024-01-15T14:20:00Z",
      "status": "open",
      "description": "Hash du bloc ne correspond pas au hash calculé",
      "resolution": null,
      "assignedTo": null
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 50,
    "hasNext": true
  }
}
```

#### POST /api/validator/anomalies/:id/resolve
Marquer une anomalie comme résolue.

**Request:**
```json
{
  "resolution": "Hash corrigé après re-synchronisation avec CDSEC",
  "resolvedBy": "admin",
  "actionTaken": "revalidation"
}
```

**Response (200):**
```json
{
  "success": true,
  "anomaly": {
    "id": "anomaly-789",
    "status": "resolved",
    "resolvedAt": "2024-01-15T15:30:00Z",
    "resolution": "Hash corrigé après re-synchronisation avec CDSEC"
  }
}
```

### ⛓️ Endpoints Blockchain

#### GET /api/blockchain/chain-validations
Historique des validations de la chaîne complète.

**Query Parameters:**
```
?limit=100&offset=0&startDate=2024-01-01&endDate=2024-01-15
```

**Response (200):**
```json
{
  "chainValidations": [
    {
      "id": "chain-val-123",
      "validatedAt": "2024-01-15T14:00:00Z",
      "blockRange": {
        "start": 1000,
        "end": 1100
      },
      "status": "valid",
      "integrityScore": 100.0,
      "anomaliesFound": 0,
      "validationTime": 15.2,
      "validatorSignature": "signature123..."
    }
  ],
  "chainSummary": {
    "totalBlocks": 5678,
    "validatedBlocks": 5674,
    "pendingValidation": 4,
    "overallIntegrityScore": 99.93
  }
}
```

#### GET /api/blockchain/integrity-report
Rapport d'intégrité détaillé de la blockchain.

**Response (200):**
```json
{
  "reportId": "integrity-report-456",
  "generatedAt": "2024-01-15T15:00:00Z",
  "validatedBy": {
    "nodeId": "validator-node-001",
    "organization": "Association Citoyenne",
    "publicKey": "ed25519:ABC123..."
  },
  "overallScore": 99.93,
  "blockchainHealth": "excellent",
  "totalBlocks": 5678,
  "validatedBlocks": 5674,
  "anomalies": [
    {
      "blockId": "block-456",
      "type": "timestampInconsistency",
      "severity": "low",
      "description": "Timestamp légèrement décalé (< 5 sec)"
    }
  ],
  "recommendations": [
    "Re-synchroniser le bloc 456",
    "Vérifier la synchronisation d'horloge du nœud source"
  ],
  "signature": "ed25519:DEF789...",
  "previousReportHash": "abc123..."
}
```

#### GET /api/blockchain/blocks/:blockId
Détails d'un bloc spécifique avec validation.

**Response (200):**
```json
{
  "block": {
    "id": "block-123",
    "index": 1234,
    "hash": "abc123...",
    "previousHash": "def456...",
    "timestamp": "2024-01-15T14:15:00Z",
    "data": {
      "type": "election_data",
      "content": "[données électorales chiffrées]"
    },
    "validations": [
      {
        "validatorId": "validator-node-001",
        "validatedAt": "2024-01-15T14:16:00Z",
        "status": "valid",
        "signature": "ed25519:GHI789..."
      }
    ]
  },
  "integrity": {
    "hashValid": true,
    "chainContinuity": true,
    "timestampValid": true,
    "signatureValid": true,
    "overallValid": true
  }
}
```

### 👥 Endpoints Administration

#### GET /api/admin/dashboard
Données complètes pour le tableau de bord.

**Response (200):**
```json
{
  "systemHealth": {
    "status": "healthy",
    "uptime": 86400000,
    "cpu": 12.5,
    "memory": {
      "used": 156,
      "total": 2048
    },
    "disk": {
      "used": 1.2,
      "total": 10
    }
  },
  "validationStats": {
    "today": {
      "validations": 45,
      "blocks": 234,
      "anomalies": 2
    },
    "thisWeek": {
      "validations": 312,
      "blocks": 1678,
      "anomalies": 8
    }
  },
  "recentActivity": [
    {
      "type": "validation",
      "message": "45 blocs validés avec succès",
      "timestamp": "2024-01-15T14:30:00Z"
    },
    {
      "type": "anomaly",
      "message": "Anomalie détectée sur le bloc 456",
      "timestamp": "2024-01-15T14:25:00Z",
      "severity": "medium"
    }
  ],
  "alerts": [
    {
      "id": "alert-123",
      "type": "performance",
      "message": "Temps de validation élevé (> 30s)",
      "severity": "warning",
      "createdAt": "2024-01-15T14:20:00Z"
    }
  ]
}
```

#### POST /api/admin/generate-keys
Génération d'une nouvelle paire de clés Ed25519.

**Request:**
```json
{
  "keyName": "validator-key-2024",
  "rotateExisting": false,
  "backupCurrent": true
}
```

**Response (200):**
```json
{
  "success": true,
  "keyInfo": {
    "keyId": "key-789",
    "publicKey": "ed25519:NEW123...",
    "createdAt": "2024-01-15T15:45:00Z",
    "status": "active"
  },
  "previousKey": {
    "keyId": "key-456",
    "status": "backed_up",
    "backedUpAt": "2024-01-15T15:45:00Z"
  },
  "message": "Nouvelle clé générée et activée avec succès"
}
```

#### GET /api/admin/export
Export complet des données pour sauvegarde/audit.

**Query Parameters:**
```
?format=json&includeKeys=false&dateRange=30d&compress=true
```

**Response (200):**
```json
{
  "exportId": "export-456",
  "createdAt": "2024-01-15T16:00:00Z",
  "format": "json",
  "size": "2.3MB",
  "downloadUrl": "/api/admin/exports/export-456/download",
  "expiresAt": "2024-01-22T16:00:00Z",
  "contents": {
    "validations": 1234,
    "blocks": 5678,
    "anomalies": 56,
    "chainValidations": 89,
    "includesKeys": false
  }
}
```

#### POST /api/admin/import
Import de données depuis un autre nœud.

**Request (multipart/form-data):**
```
file: [fichier d'export]
options: {
  "mergeStrategy": "append",
  "validateIntegrity": true,
  "backupBeforeImport": true
}
```

**Response (200):**
```json
{
  "success": true,
  "importId": "import-789",
  "summary": {
    "validationsImported": 567,
    "blocksImported": 2345,
    "anomaliesImported": 23,
    "duplicatesSkipped": 12
  },
  "warnings": [
    "12 doublons ignorés lors de l'import",
    "Vérification d'intégrité réussie pour tous les blocs"
  ]
}
```

### 🔍 Endpoints Monitoring et Santé

#### GET /api/monitoring/health
Point de santé pour les load balancers et monitoring.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T16:15:00Z",
  "checks": {
    "database": "healthy",
    "cdsecConnection": "healthy",
    "diskSpace": "healthy",
    "memory": "healthy"
  },
  "uptime": 86400000
}
```

#### GET /api/monitoring/metrics
Métriques Prometheus au format texte.

**Response (200, Content-Type: text/plain):**
```
# HELP cdsec_validator_blocks_total Total number of blocks validated
# TYPE cdsec_validator_blocks_total counter
cdsec_validator_blocks_total 5678

# HELP cdsec_validator_validations_duration_seconds Time spent validating blocks
# TYPE cdsec_validator_validations_duration_seconds histogram
cdsec_validator_validations_duration_seconds_bucket{le="1"} 450
cdsec_validator_validations_duration_seconds_bucket{le="5"} 890
cdsec_validator_validations_duration_seconds_bucket{le="10"} 920
cdsec_validator_validations_duration_seconds_bucket{le="+Inf"} 950

# HELP cdsec_validator_anomalies_total Total number of anomalies detected
# TYPE cdsec_validator_anomalies_total counter
cdsec_validator_anomalies_total{type="invalidHash"} 8
cdsec_validator_anomalies_total{type="missingBlock"} 3
```

### 🌐 Endpoints Publics (sans authentification)

#### GET /api/public/node-info
Informations publiques sur le nœud (pour le réseau distribué).

**Response (200):**
```json
{
  "nodeId": "validator-node-001",
  "organization": "Association Citoyenne",
  "contactEmail": "contact@association.org",
  "publicKey": "ed25519:ABC123...",
  "version": "1.0.0",
  "status": "active",
  "lastSeen": "2024-01-15T16:20:00Z",
  "capabilities": [
    "ed25519-validation",
    "blockchain-integrity",
    "anomaly-detection"
  ],
  "statistics": {
    "uptime": 86400000,
    "totalValidations": 1234,
    "integrityScore": 99.93
  }
}
```

#### GET /api/public/integrity-reports
Rapports d'intégrité publics signés.

**Query Parameters:**
```
?limit=10&format=json&verified=true
```

**Response (200):**
```json
{
  "reports": [
    {
      "reportId": "public-report-123",
      "generatedAt": "2024-01-15T15:00:00Z",
      "period": {
        "start": "2024-01-15T00:00:00Z",
        "end": "2024-01-15T23:59:59Z"
      },
      "summary": {
        "blocksValidated": 234,
        "integrityScore": 99.93,
        "anomaliesFound": 2
      },
      "publicUrl": "https://validator.association.org/reports/public-report-123",
      "signature": "ed25519:DEF456...",
      "verified": true
    }
  ]
}
```

### 📝 Codes de retour HTTP

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Succès de la requête |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Ressource introuvable |
| 409 | Conflict | Ressource déjà existante |
| 422 | Unprocessable Entity | Validation échouée |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Internal Server Error | Erreur serveur |
| 503 | Service Unavailable | Service temporairement indisponible |

### 🔧 Intégration et SDKs

#### JavaScript/Node.js
```javascript
const CDSECValidatorClient = require('@cdsec/validator-client');

const client = new CDSECValidatorClient({
  baseURL: 'https://validator.association.org/api',
  token: 'your-jwt-token'
});

// Obtenir le statut
const status = await client.validator.getStatus();

// Déclencher une validation
const validation = await client.validator.validate({
  blockIds: ['block-123', 'block-124']
});
```

#### Python
```python
from cdsec_validator import ValidatorClient

client = ValidatorClient(
    base_url='https://validator.association.org/api',
    token='your-jwt-token'
)

# Obtenir les statistiques
stats = client.validator.get_statistics(period='7d')

# Récupérer les anomalies
anomalies = client.validator.get_anomalies(status='open')
```

#### cURL Examples
```bash
# Authentification
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Statut du validateur (avec token)
curl -X GET http://localhost:3001/api/validator/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Validation manuelle
curl -X POST http://localhost:3001/api/validator/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"forceRevalidation": false}'
```

## 📈 Monitoring et observabilité

Le CDSEC Validator Node intègre une stack complète de monitoring moderne utilisant **Prometheus** pour la collecte de métriques et **Grafana** pour la visualisation, permettant un suivi en temps réel des performances et de la santé du système.

### 🎯 Métriques exposées

#### Métriques système
- **CPU Usage** : Utilisation processeur en pourcentage
- **Memory Usage** : Consommation mémoire (heap et RSS)
- **Disk Space** : Espace disque utilisé et disponible
- **Network I/O** : Trafic réseau entrant et sortant
- **File Descriptors** : Nombre de descripteurs de fichiers ouverts

#### Métriques applicatives
- **Validation Metrics** :
  - `cdsec_validator_blocks_total` : Nombre total de blocs validés
  - `cdsec_validator_validations_duration_seconds` : Temps de validation par bloc
  - `cdsec_validator_validation_rate` : Taux de validation (blocs/seconde)
  - `cdsec_validator_success_rate` : Pourcentage de validations réussies

- **Anomaly Metrics** :
  - `cdsec_validator_anomalies_total` : Nombre total d'anomalies détectées
  - `cdsec_validator_anomalies_by_type` : Répartition des anomalies par type
  - `cdsec_validator_anomaly_resolution_time` : Temps moyen de résolution

- **API Metrics** :
  - `cdsec_validator_http_requests_total` : Nombre de requêtes HTTP par endpoint
  - `cdsec_validator_http_request_duration_seconds` : Latence des requêtes
  - `cdsec_validator_http_errors_total` : Nombre d'erreurs HTTP par code

#### Métriques blockchain
- **Chain Integrity** :
  - `cdsec_validator_chain_integrity_score` : Score d'intégrité global (0-100)
  - `cdsec_validator_chain_height` : Hauteur de la chaîne validée
  - `cdsec_validator_missing_blocks` : Nombre de blocs manquants détectés

- **Cryptographic Operations** :
  - `cdsec_validator_signature_verifications_total` : Vérifications de signature
  - `cdsec_validator_hash_computations_total` : Calculs de hash
  - `cdsec_validator_crypto_errors_total` : Erreurs cryptographiques

### 📊 Configuration Prometheus

#### prometheus.yml
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'cdsec-validator'
    static_configs:
      - targets: ['validator:3001']
    metrics_path: '/api/monitoring/metrics'
    scrape_interval: 30s
    scrape_timeout: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
    scrape_interval: 15s

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

#### Alertes configurées (alert_rules.yml)
```yaml
groups:
  - name: cdsec-validator-alerts
    rules:
      - alert: ValidatorDown
        expr: up{job="cdsec-validator"} == 0
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "CDSEC Validator est arrêté"
          description: "Le service validator est inaccessible depuis {{ $value }} secondes"

      - alert: HighAnomalyRate
        expr: rate(cdsec_validator_anomalies_total[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Taux d'anomalies élevé"
          description: "{{ $value }} anomalies détectées par minute"

      - alert: LowIntegrityScore
        expr: cdsec_validator_chain_integrity_score < 95
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Score d'intégrité faible"
          description: "Score d'intégrité de la blockchain: {{ $value }}%"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Utilisation mémoire élevée"
          description: "Utilisation mémoire: {{ $value | humanizePercentage }}"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Espace disque faible"
          description: "Espace disque disponible: {{ $value | humanizePercentage }}"

      - alert: ValidationLatencyHigh
        expr: histogram_quantile(0.95, rate(cdsec_validator_validations_duration_seconds_bucket[5m])) > 30
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "Latence de validation élevée"
          description: "95e percentile des validations: {{ $value }}s"
```

### 📈 Tableaux de bord Grafana

#### Dashboard principal : "CDSEC Validator Overview"
Le tableau de bord principal offre une vue d'ensemble complète :

**Première ligne - Métriques clés** :
- Status global du validateur (UP/DOWN avec couleur)
- Nombre total de validations (compteur avec évolution)
- Score d'intégrité actuel (jauge 0-100%)
- Anomalies actives (alerte visuelle si > 0)

**Deuxième ligne - Performance** :
- Graphique temporel des validations par heure
- Latence des validations (P50, P95, P99)
- Taux de succès des validations (%)
- Débit réseau (requêtes/seconde)

**Troisième ligne - Système** :
- Utilisation CPU (%)
- Utilisation mémoire (MB et %)
- Espace disque (GB disponible)
- Nombre de connexions actives

**Quatrième ligne - Blockchain** :
- Hauteur de la chaîne validée
- Blocs validés vs reçus
- Distribution des types d'anomalies
- Historique du score d'intégrité

#### Dashboard technique : "CDSEC Validator Deep Dive"
Pour les administrateurs techniques :

**Métriques détaillées** :
- Distribution des temps de réponse API
- Logs d'erreurs en temps réel
- Métriques de garbage collection (Node.js)
- Détails des opérations cryptographiques

**Analyse des anomalies** :
- Timeline des anomalies détectées
- Corrélation anomalies/performance
- Top 10 des types d'anomalies
- Temps de résolution moyen

### 🚨 Système d'alerting

#### Configuration Alertmanager
```yaml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@validator.association.org'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    email_configs:
      - to: 'admin@association.org'
        subject: '[CDSEC Validator] {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alerte: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Sévérité: {{ .Labels.severity }}
          Instance: {{ .Labels.instance }}
          {{ end }}

    webhook_configs:
      - url: 'http://validator:3001/api/alerts/webhook'
        send_resolved: true
```

#### Intégration Slack/Discord
```yaml
  - name: 'slack-alerts'
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#cdsec-monitoring'
        title: 'CDSEC Validator Alert'
        text: '{{ .CommonAnnotations.summary }}'
        color: '{{ if eq .Status "firing" }}danger{{ else }}good{{ end }}'
```

### 📱 Accès aux interfaces de monitoring

#### URLs d'accès (après `docker-compose up -d`)
- **Grafana Dashboard** : http://localhost:3000
  - Identifiants par défaut : `admin` / `admin`
  - Dashboard principal : "CDSEC Validator Overview"
  - Dashboard technique : "CDSEC Validator Deep Dive"

- **Prometheus UI** : http://localhost:9090
  - Interface de requête et exploration des métriques
  - Visualisation des règles d'alerte et leur statut
  - Graphiques simples pour le debug

- **Alertmanager** : http://localhost:9093
  - Gestion des alertes actives
  - Configuration des canaux de notification
  - Historique des alertes

### 🔧 Personnalisation du monitoring

#### Ajout de métriques custom
```javascript
// Dans le code backend
const promClient = require('prom-client');

// Nouvelle métrique custom
const customValidationGauge = new promClient.Gauge({
  name: 'cdsec_validator_custom_score',
  help: 'Score personnalisé de validation',
  labelNames: ['validator_id', 'data_source']
});

// Mise à jour de la métrique
customValidationGauge.set(
  { validator_id: nodeId, data_source: 'cdsec_api' },
  calculatedScore
);
```

#### Configuration des seuils d'alerte
Variables d'environnement pour personnaliser les alertes :
```bash
# Seuils d'alertes personnalisables
ALERT_MEMORY_THRESHOLD=0.85          # 85% utilisation mémoire
ALERT_DISK_THRESHOLD=0.20            # 20% espace libre minimum
ALERT_INTEGRITY_THRESHOLD=98         # Score intégrité minimum
ALERT_ANOMALY_RATE=0.05             # Max 0.05 anomalies/minute
ALERT_VALIDATION_LATENCY=20          # Max 20 secondes par validation
```

### 📊 Export et archivage des métriques

#### Retention Prometheus
```yaml
# Dans docker-compose.yml
prometheus:
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--storage.tsdb.path=/prometheus'
    - '--storage.tsdb.retention.time=90d'    # 90 jours de rétention
    - '--storage.tsdb.retention.size=10GB'   # Max 10 GB de stockage
```

#### Sauvegarde automatique Grafana
```bash
# Script de sauvegarde des dashboards
#!/bin/bash
grafana-cli admin export-dashboard \
  --dashboard-uid=cdsec-overview \
  --output=/backups/cdsec-dashboard-$(date +%Y%m%d).json
```

## 🐳 Déploiement

Le CDSEC Validator Node est entièrement conteneurisé et optimisé pour un déploiement simple et robuste en production.

### 🚀 Déploiement rapide avec Docker Compose

#### Structure des services
Le `docker-compose.yml` orchestre plusieurs services :

```yaml
version: '3.8'

services:
  # Service principal du validateur
  validator:
    build: .
    container_name: cdsec-validator
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    volumes:
      - validator-data:/app/data
      - validator-logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/monitoring/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      - prometheus

  # Collecte de métriques
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: cdsec-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml:ro
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=90d'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    restart: unless-stopped

  # Visualisation et dashboards
  grafana:
    image: grafana/grafana:10.0.0
    container_name: cdsec-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    restart: unless-stopped
    depends_on:
      - prometheus

  # Métriques système
  node-exporter:
    image: prom/node-exporter:v1.6.0
    container_name: cdsec-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($|/)'
    restart: unless-stopped

  # Gestion des alertes (optionnel)
  alertmanager:
    image: prom/alertmanager:v0.25.0
    container_name: cdsec-alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
      - alertmanager-data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    restart: unless-stopped

volumes:
  validator-data:
    driver: local
  validator-logs:
    driver: local
  prometheus-data:
    driver: local
  grafana-data:
    driver: local
  alertmanager-data:
    driver: local

networks:
  default:
    name: cdsec-validator-network
```

#### Commandes de déploiement
```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier le statut des services
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f validator

# Redémarrer un service spécifique
docker-compose restart validator

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ Perte de données)
docker-compose down -v
```

### 🏗️ Build personnalisé

#### Dockerfile optimisé pour la production
```dockerfile
# Étape 1: Build du frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Étape 2: Build du backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

# Étape 3: Image de production
FROM node:20-alpine AS production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S validator -u 1001

# Installer les dépendances système nécessaires
RUN apk add --no-cache \
    curl \
    sqlite \
    tini

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de production
COPY --from=backend-builder --chown=validator:nodejs /app/backend ./
COPY --from=frontend-builder --chown=validator:nodejs /app/frontend/dist ./public

# Créer les répertoires de données
RUN mkdir -p /app/data /app/logs && \
    chown -R validator:nodejs /app/data /app/logs

# Basculer vers l'utilisateur non-root
USER validator

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/validator.db

# Ports exposés
EXPOSE 3001

# Healthcheck pour Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/api/monitoring/health || exit 1

# Point d'entrée avec tini pour gestion des signaux
ENTRYPOINT ["/sbin/tini", "--"]

# Commande par défaut
CMD ["node", "app.js"]
```

#### Build et publication
```bash
# Build de l'image
docker build -t cdsec-validator:latest .

# Tag pour un registre privé
docker tag cdsec-validator:latest registry.association.org/cdsec-validator:1.0.0

# Publication vers le registre
docker push registry.association.org/cdsec-validator:1.0.0

# Build multi-architecture (ARM64 + AMD64)
docker buildx build --platform linux/amd64,linux/arm64 \
  -t cdsec-validator:latest --push .
```

### 🌐 Déploiement en production

#### Configuration nginx en reverse proxy
```nginx
upstream cdsec_validator {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name validator.association.org;

    # Certificats SSL (Let's Encrypt recommandé)
    ssl_certificate /etc/letsencrypt/live/validator.association.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/validator.association.org/privkey.pem;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Logs
    access_log /var/log/nginx/cdsec-validator.access.log;
    error_log /var/log/nginx/cdsec-validator.error.log;

    # Configuration générale
    client_max_body_size 10M;
    keepalive_timeout 65;

    # Proxy vers le validateur
    location / {
        proxy_pass http://cdsec_validator;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache statique pour les assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://cdsec_validator;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Métriques Prometheus (accès restreint)
    location /api/monitoring/metrics {
        allow 10.0.0.0/8;    # Réseau interne
        allow 172.16.0.0/12; # Docker networks
        deny all;
        proxy_pass http://cdsec_validator;
    }
}

# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name validator.association.org;
    return 301 https://$server_name$request_uri;
}
```

#### Systemd service pour gestion système
```ini
# /etc/systemd/system/cdsec-validator.service
[Unit]
Description=CDSEC Validator Node
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/cdsec-validator
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Activer le service
sudo systemctl enable cdsec-validator.service
sudo systemctl start cdsec-validator.service

# Vérifier le statut
sudo systemctl status cdsec-validator.service
```

### ☸️ Déploiement Kubernetes (optionnel)

#### Manifestes Kubernetes
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cdsec-validator

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cdsec-validator-config
  namespace: cdsec-validator
data:
  VALIDATOR_NODE_ID: "k8s-validator-001"
  ORGANIZATION: "Association Citoyenne"
  AUTO_VALIDATION_ENABLED: "true"
  VALIDATION_INTERVAL: "300000"

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: cdsec-validator-secrets
  namespace: cdsec-validator
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  ADMIN_PASSWORD: <base64-encoded-password>

---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cdsec-validator
  namespace: cdsec-validator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cdsec-validator
  template:
    metadata:
      labels:
        app: cdsec-validator
    spec:
      containers:
      - name: validator
        image: cdsec-validator:latest
        ports:
        - containerPort: 3001
        envFrom:
        - configMapRef:
            name: cdsec-validator-config
        - secretRef:
            name: cdsec-validator-secrets
        volumeMounts:
        - name: data-volume
          mountPath: /app/data
        livenessProbe:
          httpGet:
            path: /api/monitoring/health
            port: 3001
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/monitoring/health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
      volumes:
      - name: data-volume
        persistentVolumeClaim:
          claimName: cdsec-validator-pvc

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: cdsec-validator-service
  namespace: cdsec-validator
spec:
  selector:
    app: cdsec-validator
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cdsec-validator-ingress
  namespace: cdsec-validator
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - validator.association.org
    secretName: cdsec-validator-tls
  rules:
  - host: validator.association.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cdsec-validator-service
            port:
              number: 80
```

### 🔧 Scripts de déploiement automatisé

#### Script de déploiement complet
```bash
#!/bin/bash
# deploy.sh - Script de déploiement automatisé

set -euo pipefail

# Configuration
REPO_URL="https://github.com/your-org/cdsec-validator.git"
DEPLOY_DIR="/opt/cdsec-validator"
BACKUP_DIR="/opt/cdsec-validator-backups"
LOG_FILE="/var/log/cdsec-validator-deploy.log"

# Fonctions utilitaires
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERREUR: $1"
    exit 1
}

# Vérifications préalables
check_requirements() {
    log "Vérification des prérequis..."
    
    command -v docker >/dev/null 2>&1 || error_exit "Docker n'est pas installé"
    command -v docker-compose >/dev/null 2>&1 || error_exit "Docker Compose n'est pas installé"
    command -v git >/dev/null 2>&1 || error_exit "Git n'est pas installé"
    
    # Vérifier l'espace disque (minimum 5GB)
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -lt 5242880 ]; then
        error_exit "Espace disque insuffisant (minimum 5GB requis)"
    fi
    
    log "Prérequis vérifiés avec succès"
}

# Sauvegarde avant déploiement
backup_current() {
    if [ -d "$DEPLOY_DIR" ]; then
        log "Sauvegarde de l'installation actuelle..."
        BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S')"
        mkdir -p "$BACKUP_DIR"
        
        # Exporter les données avant sauvegarde
        cd "$DEPLOY_DIR"
        if docker-compose ps | grep -q "Up"; then
            docker-compose exec -T validator curl -X GET \
                "http://localhost:3001/api/admin/export?format=json" \
                -H "Authorization: Bearer $ADMIN_TOKEN" \
                > "$BACKUP_DIR/${BACKUP_NAME}-data.json" 2>/dev/null || true
        fi
        
        tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" -C "$(dirname $DEPLOY_DIR)" "$(basename $DEPLOY_DIR)"
        log "Sauvegarde créée: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    fi
}

# Déploiement principal
deploy() {
    log "Début du déploiement..."
    
    # Cloner ou mettre à jour le repository
    if [ -d "$DEPLOY_DIR" ]; then
        log "Mise à jour du code source..."
        cd "$DEPLOY_DIR"
        git fetch origin
        git reset --hard origin/main
    else
        log "Clonage du repository..."
        git clone "$REPO_URL" "$DEPLOY_DIR"
        cd "$DEPLOY_DIR"
    fi
    
    # Vérifier la configuration
    if [ ! -f ".env" ]; then
        log "Création du fichier .env à partir de .env.example..."
        cp .env.example .env
        log "⚠️  ATTENTION: Modifiez le fichier .env avant la première utilisation!"
    fi
    
    # Build et démarrage
    log "Build et démarrage des services..."
    docker-compose pull
    docker-compose build --no-cache
    docker-compose up -d
    
    # Attendre que les services soient prêts
    log "Attente du démarrage des services..."
    for i in {1..60}; do
        if curl -f http://localhost:3001/api/monitoring/health >/dev/null 2>&1; then
            log "Services démarrés avec succès"
            break
        fi
        
        if [ $i -eq 60 ]; then
            error_exit "Timeout: Les services n'ont pas démarré correctement"
        fi
        
        sleep 5
    done
}

# Vérification post-déploiement
verify_deployment() {
    log "Vérification du déploiement..."
    
    # Vérifier les services
    SERVICES=("validator" "prometheus" "grafana")
    for service in "${SERVICES[@]}"; do
        if ! docker-compose ps "$service" | grep -q "Up"; then
            error_exit "Le service $service n'est pas actif"
        fi
    done
    
    # Vérifier les endpoints
    ENDPOINTS=(
        "http://localhost:3001/api/monitoring/health"
        "http://localhost:9090/-/healthy"
        "http://localhost:3000/api/health"
    )
    
    for endpoint in "${ENDPOINTS[@]}"; do
        if ! curl -f "$endpoint" >/dev/null 2>&1; then
            log "⚠️  ATTENTION: L'endpoint $endpoint n'est pas accessible"
        fi
    done
    
    log "Déploiement vérifié avec succès"
}

# Nettoyage des anciennes images Docker
cleanup() {
    log "Nettoyage des ressources Docker inutiles..."
    docker system prune -f
    docker image prune -f
}

# Script principal
main() {
    log "=== Démarrage du déploiement CDSEC Validator Node ==="
    
    check_requirements
    backup_current
    deploy
    verify_deployment
    cleanup
    
    log "=== Déploiement terminé avec succès ==="
    log "Interface web: http://localhost:3001"
    log "Prometheus: http://localhost:9090"
    log "Grafana: http://localhost:3000"
    
    # Afficher les informations importantes
    echo "
┌─────────────────────────────────────────────────────┐
│                DÉPLOIEMENT RÉUSSI                   │
├─────────────────────────────────────────────────────┤
│ Interface web: http://localhost:3001                │
│ Monitoring:    http://localhost:3000                │
│                                                     │
│ ⚠️  IMPORTANT: Changez les mots de passe par défaut │
│    avant la mise en production!                     │
│                                                     │
│ 📖 Documentation complète disponible dans le       │
│    fichier README.md                                │
└─────────────────────────────────────────────────────┘
    "
}

# Gestion des erreurs
trap 'log "Script interrompu"; exit 1' INT TERM

# Exécution
main "$@"
```

#### Script de mise à jour
```bash
#!/bin/bash
# update.sh - Mise à jour du CDSEC Validator Node

set -euo pipefail

DEPLOY_DIR="/opt/cdsec-validator"

cd "$DEPLOY_DIR"

echo "🔄 Mise à jour du CDSEC Validator Node..."

# Sauvegarder les données
echo "💾 Sauvegarde des données..."
docker-compose exec -T validator curl -X GET \
    "http://localhost:3001/api/admin/export?format=json" \
    > "backup-pre-update-$(date +'%Y%m%d').json"

# Mettre à jour le code
echo "📥 Téléchargement des mises à jour..."
git pull origin main

# Redémarrer les services
echo "🔄 Redémarrage des services..."
docker-compose pull
docker-compose up -d --build

# Vérifier la mise à jour
echo "✅ Vérification..."
sleep 10
curl -f http://localhost:3001/api/monitoring/health || {
    echo "❌ Erreur lors de la mise à jour"
    exit 1
}

echo "✅ Mise à jour terminée avec succès!"
```

### 📋 Checklist de déploiement en production

#### Avant le déploiement
- [ ] **Serveur préparé** : OS à jour, Docker installé, utilisateur non-root créé
- [ ] **Domaine configuré** : DNS pointant vers le serveur
- [ ] **Certificats SSL** : Let's Encrypt ou certificat valide
- [ ] **Firewall configuré** : Ports 80, 443 ouverts, autres ports restreints
- [ ] **Monitoring externe** : Uptimerobot ou équivalent configuré

#### Configuration sécurisée
- [ ] **Mots de passe changés** : JWT_SECRET, ADMIN_PASSWORD, GRAFANA_ADMIN_PASSWORD
- [ ] **Variables d'environnement** : Toutes les valeurs de production configurées
- [ ] **Accès restreints** : Métriques Prometheus limitées aux IPs internes
- [ ] **Logs sécurisés** : Rotation activée, informations sensibles masquées
- [ ] **Sauvegardes programmées** : Script automatique configuré

#### Post-déploiement
- [ ] **Tests fonctionnels** : Interface accessible, validation manuelle OK
- [ ] **Monitoring opérationnel** : Grafana dashboards configurés, alertes testées
- [ ] **Documentation mise à jour** : URLs de production, contacts mis à jour
- [ ] **Formation équipe** : Administrateurs formés à l'interface
- [ ] **Plan de maintenance** : Procédures de mise à jour documentées

## 📁 Structure du projet

La structure du CDSEC Validator Node suit les bonnes pratiques de développement moderne avec une séparation claire entre frontend, backend et configuration.

```
cdsec-validator/
├── 📁 backend/                 # Backend Node.js + Express
│   ├── 📁 routes/             # Routes API REST
│   │   ├── auth.js            # Authentification JWT
│   │   ├── validator.js       # Endpoints validateur
│   │   ├── blockchain.js      # Endpoints blockchain
│   │   ├── admin.js          # Administration
│   │   └── monitoring.js     # Monitoring et métriques
│   ├── 📁 services/           # Services métier
│   │   ├── validationService.js    # Logique de validation
│   │   ├── blockchainService.js    # Gestion blockchain
│   │   ├── cryptoService.js        # Opérations cryptographiques
│   │   ├── anomalyService.js       # Détection d'anomalies
│   │   └── reportService.js        # Génération de rapports
│   ├── 📁 middleware/         # Middlewares Express
│   │   ├── auth.js           # Vérification JWT
│   │   ├── rateLimiter.js    # Rate limiting
│   │   ├── validation.js     # Validation des données
│   │   └── security.js       # Headers de sécurité
│   ├── 📁 utils/              # Utilitaires
│   │   ├── logger.js         # Configuration logging
│   │   ├── database.js       # Abstraction base de données
│   │   ├── crypto.js         # Utilitaires cryptographiques
│   │   └── config.js         # Gestion configuration
│   ├── 📁 models/             # Modèles de données
│   │   ├── Block.js          # Modèle bloc blockchain
│   │   ├── Validation.js     # Modèle validation
│   │   ├── Anomaly.js        # Modèle anomalie
│   │   └── ChainValidation.js # Modèle validation chaîne
│   ├── 📁 tests/              # Tests unitaires et intégration
│   │   ├── routes/           # Tests des routes
│   │   ├── services/         # Tests des services
│   │   └── utils/            # Tests des utilitaires
│   ├── app.js                # Point d'entrée principal
│   ├── package.json          # Dépendances Node.js
│   └── package-lock.json     # Versions verrouillées
├── 📁 frontend/               # Frontend React.js
│   ├── 📁 src/
│   │   ├── 📁 components/     # Composants UI réutilisables
│   │   │   ├── 📁 ui/         # Composants de base (shadcn/ui)
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   └── ...
│   │   │   ├── Header.jsx     # En-tête navigation
│   │   │   ├── Sidebar.jsx    # Barre latérale
│   │   │   ├── StatusBadge.jsx # Badges de statut
│   │   │   └── Charts/        # Composants graphiques
│   │   │       ├── ValidationChart.jsx
│   │   │       ├── IntegrityChart.jsx
│   │   │       └── AnomalyChart.jsx
│   │   ├── 📁 pages/          # Pages de l'application
│   │   │   ├── Dashboard.jsx  # Tableau de bord principal
│   │   │   ├── Validator.jsx  # Gestion du validateur
│   │   │   ├── Blockchain.jsx # Exploration blockchain
│   │   │   ├── Anomalies.jsx  # Gestion des anomalies
│   │   │   ├── Settings.jsx   # Paramètres système
│   │   │   └── Login.jsx      # Page de connexion
│   │   ├── 📁 hooks/          # Hooks React personnalisés
│   │   │   ├── useAuth.js     # Gestion authentification
│   │   │   ├── useApi.js      # Appels API
│   │   │   ├── useWebSocket.js # WebSocket temps réel
│   │   │   └── useLocalStorage.js # Stockage local
│   │   ├── 📁 services/       # Services frontend
│   │   │   ├── api.js         # Client API REST
│   │   │   ├── auth.js        # Service authentification
│   │   │   └── websocket.js   # Service WebSocket
│   │   ├── 📁 utils/          # Utilitaires frontend
│   │   │   ├── formatters.js  # Formatage données
│   │   │   ├── validators.js  # Validation formulaires
│   │   │   └── constants.js   # Constantes
│   │   ├── App.jsx            # Composant racine
│   │   ├── main.jsx          # Point d'entrée React
│   │   └── index.css         # Styles globaux
│   ├── 📁 public/            # Assets publics
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── index.html            # Template HTML
│   ├── package.json          # Dépendances frontend
│   ├── vite.config.js        # Configuration Vite
│   └── tailwind.config.js    # Configuration Tailwind
├── 📁 monitoring/            # Configuration monitoring
│   ├── prometheus.yml        # Config Prometheus
│   ├── alert_rules.yml       # Règles d'alerte
│   ├── alertmanager.yml      # Config Alertmanager
│   └── 📁 grafana/          # Configuration Grafana
│       ├── 📁 dashboards/    # Dashboards JSON
│       │   ├── cdsec-overview.json
│       │   └── cdsec-technical.json
│       └── 📁 provisioning/ # Provisioning automatique
│           ├── 📁 dashboards/
│           └── 📁 datasources/
├── 📁 scripts/              # Scripts utilitaires
│   ├── deploy.sh            # Script déploiement
│   ├── update.sh            # Script mise à jour
│   ├── backup.sh            # Script sauvegarde
│   ├── restore.sh           # Script restauration
│   └── init-db.js          # Initialisation base de données
├── 📁 docs/                 # Documentation
│   ├── API.md              # Documentation API
│   ├── DEPLOYMENT.md       # Guide déploiement
│   ├── CONFIGURATION.md    # Guide configuration
│   └── TROUBLESHOOTING.md  # Guide dépannage
├── 📁 data/                # Données persistantes (créé automatiquement)
│   ├── validator.db        # Base de données SQLite
│   ├── 📁 keys/           # Clés cryptographiques
│   └── 📁 backups/        # Sauvegardes automatiques
├── 📁 logs/               # Logs application (créé automatiquement)
│   ├── app.log           # Log principal
│   ├── error.log         # Log erreurs
│   └── access.log        # Log accès HTTP
├── Dockerfile             # Configuration Docker
├── docker-compose.yml     # Orchestration services
├── .env.example          # Variables d'environnement exemple
├── .gitignore            # Exclusions Git
├── .dockerignore         # Exclusions Docker
├── package.json          # Métadonnées projet
├── README.md             # Documentation principale
└── LICENSE               # Licence MIT
```

### 🔍 Détail des composants clés

#### Backend Services

**validationService.js** - Service principal de validation
```javascript
class ValidationService {
  async validateBlock(blockData) {
    // Vérification hash, signature, cohérence temporelle
  }
  
  async validateChain(startBlock, endBlock) {
    // Validation de continuité de la chaîne
  }
  
  async detectAnomalies(validationResults) {
    // Détection et classification des anomalies
  }
}
```

**cryptoService.js** - Opérations cryptographiques
```javascript
class CryptoService {
  generateKeyPair() {
    // Génération clés Ed25519
  }
  
  signData(data, privateKey) {
    // Signature numérique
  }
  
  verifySignature(data, signature, publicKey) {
    // Vérification signature
  }
  
  computeHash(data) {
    // Calcul hash SHA-256
  }
}
```

#### Frontend Components

**Dashboard.jsx** - Tableau de bord principal
```jsx
const Dashboard = () => {
  const { status } = useValidatorStatus();
  const { stats } = useValidationStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatusCard status={status} />
      <StatsCard stats={stats} />
      <RecentActivity />
    </div>
  );
};
```

**useApi.js** - Hook pour appels API
```javascript
export const useApi = () => {
  const { token } = useAuth();
  
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }, [token]);
  
  return { apiCall };
};
```

### 📦 Gestion des dépendances

#### Backend (Node.js)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.10.0",
    "joi": "^17.9.2",
    "winston": "^3.10.0",
    "tweetnacl": "^1.0.3",
    "prom-client": "^14.2.0",
    "node-cron": "^3.0.2"
  },
  "devDependencies": {
    "jest": "^29.6.0",
    "supertest": "^6.3.3",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "nodemon": "^3.0.1"
  }
}
```

#### Frontend (React)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2",
    "lucide-react": "^0.263.1",
    "recharts": "^2.7.2",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "vite": "^4.4.5",
    "@vitejs/plugin-react": "^4.0.3",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2"
  }
}
```

## 🔄 Développement

Le CDSEC Validator Node est conçu pour faciliter le développement local et la contribution de la communauté.

### 🛠️ Installation pour le développement

#### Prérequis développement
- **Node.js 20+** avec npm ou pnpm
- **Git** pour gestion de version
- **VS Code** (recommandé) avec extensions :
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter  
  - ESLint
  - Thunder Client (test API)

#### Setup environnement local
```bash
# 1. Cloner le repository
git clone https://github.com/your-org/cdsec-validator.git
cd cdsec-validator

# 2. Installer les dépendances backend
cd backend
npm install

# 3. Installer les dépendances frontend
cd ../frontend
npm install
# ou avec pnpm (plus rapide)
pnpm install

# 4. Copier la configuration de développement
cd ..
cp .env.example .env.development

# 5. Initialiser la base de données
cd backend
npm run init-db
```

#### Configuration développement
```bash
# .env.development
NODE_ENV=development
PORT=3001
DB_PATH=./data/validator-dev.db

# Sécurité (valeurs de développement)
JWT_SECRET=dev-secret-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# API CDSEC (mock pour développement)
CDSEC_API_URL=http://localhost:8080/api
AUTO_VALIDATION_ENABLED=false  # Désactivé en dev

# Logs verbeux pour développement
LOG_LEVEL=debug
```

### 🚀 Démarrage en mode développement

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# ou pour les logs détaillés
npm run dev:verbose
```

#### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
# ou avec pnpm
pnpm dev
```

#### URLs de développement
- **Interface web** : http://localhost:5173 (Vite dev server)
- **API Backend** : http://localhost:3001/api
- **API Docs** : http://localhost:3001/api/docs (Swagger UI)

### 🧪 Tests

#### Tests backend
```bash
cd backend

# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch (développement)
npm run test:watch

# Tests d'intégration seulement
npm run test:integration
```

#### Tests frontend
```bash
cd frontend

# Tests unitaires React
npm test

# Tests E2E avec Playwright
npm run test:e2e

# Tests avec interface graphique
npm run test:ui
```

#### Structure des tests
```
backend/tests/
├── unit/                  # Tests unitaires
│   ├── services/         # Tests des services
│   ├── utils/           # Tests des utilitaires
│   └── models/          # Tests des modèles
├── integration/          # Tests d'intégration
│   ├── api/            # Tests des endpoints
│   └── database/       # Tests base de données
└── fixtures/            # Données de test
    ├── blocks.json
    └── validations.json

frontend/src/__tests__/
├── components/          # Tests composants
├── hooks/              # Tests hooks
├── services/           # Tests services
└── e2e/               # Tests end-to-end
```

### 🔍 Debugging et profiling

#### Backend debugging (VS Code)
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/app.js",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "cdsec:*"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "${workspaceFolder}/backend/node_modules/.bin/nodemon",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Debugging frontend
```javascript
// Utilisation de React Developer Tools
// Installation: npm install -g react-devtools

// Debug avec console conditionnelle
const debugLog = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🐛 ${message}:`, data);
  }
};

// Hook de debug personnalisé
const useDebug = (componentName) => {
  useEffect(() => {
    console.log(`📦 ${componentName} mounted`);
    return () => console.log(`📦 ${componentName} unmounted`);
  }, [componentName]);
};
```

#### Profiling performances
```bash
# Backend - Profiling Node.js
cd backend
npm run profile

# Frontend - Bundle analyzer
cd frontend
npm run analyze

# Monitoring mémoire
npm run memory-test
```

### 🔧 Scripts de développement

#### Package.json backend
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "dev:verbose": "DEBUG=cdsec:* nodemon app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "init-db": "node scripts/init-database.js",
    "migrate": "node scripts/migrate-database.js",
    "seed": "node scripts/seed-database.js",
    "profile": "node --prof app.js",
    "memory-test": "node --inspect app.js"
  }
}
```

#### Package.json frontend
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext .js,.jsx",
    "lint:fix": "eslint . --ext .js,.jsx --fix",
    "format": "prettier --write .",
    "analyze": "npm run build && npx vite-bundle-analyzer dist",
    "type-check": "tsc --noEmit"
  }
}
```

### 🔄 Workflow de développement

#### Git Flow simplifié
```bash
# 1. Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer et committer
git add .
git commit -m "feat: ajouter validation de signature Ed25519"

# 3. Tests avant push
npm run test
npm run lint

# 4. Push et Pull Request
git push origin feature/nouvelle-fonctionnalite
# Créer PR sur GitHub/GitLab
```

#### Commits conventionnels
```bash
# Types de commits utilisés
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatage, pas de changement de logique
refactor: # Refactoring sans changement fonctionnel
test:     # Ajout/modification de tests
chore:    # Tâches de maintenance

# Exemples
git commit -m "feat(validation): ajouter vérification intégrité chaîne"
git commit -m "fix(api): corriger erreur 500 sur /validator/status"
git commit -m "docs(readme): mettre à jour guide installation"
```

#### Pre-commit hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### 🐛 Debug et troubleshooting

#### Problèmes courants

**Backend ne démarre pas**
```bash
# Vérifier le port
netstat -tulpn | grep :3001

# Vérifier les logs
tail -f backend/logs/app.log

# Réinitialiser la base de données
rm backend/data/validator-dev.db
npm run init-db
```

**Frontend ne compile pas**
```bash
# Nettoyer le cache
rm -rf node_modules/.vite
npm run dev

# Vérifier les dépendances
npm audit
npm audit fix
```

**Tests qui échouent**
```bash
# Tests isolés
npm test -- --testNamePattern="validation"

# Nettoyer les mocks
npm test -- --clearCache

# Debug un test spécifique
npm test -- --verbose services/validationService.test.js
```

#### Logs de debug

**Configuration Winston (backend)**
```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ],
});

module.exports = logger;
```

**Debug React (frontend)**
```javascript
// hooks/useDebugInfo.js
export const useDebugInfo = (componentName, props) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 ${componentName} Debug Info`);
      console.log('Props:', props);
      console.log('Render time:', new Date().toISOString());
      console.groupEnd();
    }
  }, [componentName, props]);
};
```

### 📚 Ressources pour développeurs

#### Documentation technique
- **Architecture Decision Records (ADR)** : `docs/adr/`
- **API Documentation** : Swagger UI sur `/api/docs`
- **Database Schema** : `docs/database-schema.md`
- **Security Guidelines** : `docs/security.md`

#### Outils recommandés
- **Postman Collection** : Tests API prêts à utiliser
- **VS Code Settings** : Configuration partagée dans `.vscode/`
- **Docker dev containers** : Environnement de développement isolé
- **GitHub Copilot** : Assistant IA pour le code

#### Standards de code
- **ESLint Config** : Basé sur Airbnb + React
- **Prettier Config** : Formatage automatique cohérent
- **JSDoc Comments** : Documentation du code obligatoire
- **TypeScript** : Migration progressive vers TS (roadmap)

## 🤝 Comment participer ?

Le CDSEC Validator Node est un projet open source qui encourage la participation citoyenne et technique. Voici comment votre association ou vous-même pouvez contribuer à ce système de validation démocratique.

### 🏛️ Pour les associations

#### 🖥️ Héberger un nœud validateur

**Prérequis pour héberger un nœud :**
- **Serveur dédié ou VPS** : 2 Go RAM, 20 Go stockage, connexion stable
- **Nom de domaine** : Pour l'accessibilité publique (recommandé)
- **Engagement** : Maintenir le nœud actif 99%+ du temps
- **Compétences** : Administration système Linux de base

**Étapes pour rejoindre le réseau :**

1. **Manifester votre intérêt**
   ```bash
   # Contact par email ou issue GitHub
   Sujet: "[NŒUD] Demande d'adhésion au réseau CDSEC Validator"
   Organisation: [Nom de votre association]
   Contact: [Email responsable technique]
   Serveur: [Spécifications de votre infrastructure]
   ```

2. **Configuration et déploiement**
   ```bash
   # Cloner et configurer
   git clone https://github.com/cdsec/validator-node.git
   cd validator-node
   cp .env.example .env
   
   # Personnaliser pour votre association
   VALIDATOR_NODE_ID="laquadrature-validator-001"
   ORGANIZATION="La Quadrature du Net"
   CONTACT_EMAIL="validator@laquadrature.net"
   PUBLIC_URL="https://cdsec-validator.laquadrature.net"
   ```

3. **Rejoindre le réseau distribué**
   - Échanger les clés publiques avec les autres nœuds
   - Configurer la synchronisation P2P
   - Publier votre rapport d'intégrité public

**Avantages pour votre association :**
- **Transparence** : Démontrer votre engagement pour la démocratie
- **Indépendance** : Contrôler vos propres validations
- **Réseau** : Collaborer avec d'autres associations citoyennes
- **Impact** : Contribuer directement à l'intégrité électorale

### 💻 Pour les développeurs

#### 🔧 Contribuer au code

**Types de contributions recherchées :**

1. **Fonctionnalités core**
   - Algorithmes de validation améliorés
   - Optimisations de performance
   - Nouveaux types de détection d'anomalies
   - Support de nouveaux formats de données

2. **Interface utilisateur**
   - Amélioration UX/UI
   - Nouveaux tableaux de bord
   - Accessibilité (A11Y)
   - Internationalisation (i18n)

3. **Infrastructure et DevOps**
   - Optimisations Docker
   - Scripts de déploiement
   - Configuration Kubernetes
   - Monitoring avancé

4. **Documentation**
   - Guides techniques
   - Tutoriels vidéo
   - Traductions
   - Documentation API

**Processus de contribution :**

1. **Fork et setup**
   ```bash
   # Forker sur GitHub puis cloner
   git clone https://github.com/YOUR-USERNAME/cdsec-validator.git
   cd cdsec-validator
   
   # Configuration développement
   npm run setup-dev
   npm test  # Vérifier que tout fonctionne
   ```

2. **Développer**
   ```bash
   # Créer une branche feature
   git checkout -b feature/amelioration-validation
   
   # Développer avec tests
   npm run test:watch  # Tests en continu
   npm run lint        # Vérifier le code
   ```

3. **Pull Request**
   ```bash
   git push origin feature/amelioration-validation
   # Créer PR sur GitHub avec description détaillée
   ```

**Guidelines de contribution :**
- **Tests obligatoires** : Couverture > 80% pour nouveau code
- **Documentation** : Commenter les fonctions complexes
- **Standards** : Suivre ESLint et Prettier
- **Commits** : Utiliser les conventions de commit
- **Revue** : Accepter les suggestions de code review

#### 🏆 Programme de reconnaissance

**Badges contributeurs :**
- 🥉 **Bronze** : 1ère contribution acceptée
- 🥈 **Silver** : 5 contributions majeures  
- 🥇 **Gold** : 15 contributions + mentorat nouveaux
- 💎 **Diamond** : Core maintainer

**Récompenses :**
- **Mention** sur le site web et README
- **Certificat numérique** de contribution citoyenne
- **Invitation** aux événements CDSEC
- **Opportunités** de présentation en conférence

### 📚 Contribuer à l'éducation citoyenne

#### 🎓 Pédagogie et sensibilisation

**Créer du contenu éducatif :**

1. **Articles de blog**
   - "Comprendre la validation blockchain appliquée aux élections"
   - "Pourquoi un réseau de validateurs distribué ?"
   - "Comment vérifier l'intégrité des données électorales ?"

2. **Vidéos explicatives**
   - Démo d'installation d'un nœud validateur
   - Explication des concepts cryptographiques
   - Cas d'usage concrets de détection d'anomalies

3. **Workshops et formations**
   - Formation administrateurs pour associations
   - Ateliers grand public sur la transparence électorale
   - Conférences techniques dans les universités

**Ressources à créer :**
```markdown
# Exemples de contenus recherchés

## Guide citoyen
- "Élections transparentes : le rôle des validateurs"
- "Comment votre association peut contribuer"
- "FAQ : Questions fréquentes sur CDSEC"

## Ressources techniques  
- "Architecture d'un nœud validateur"
- "Sécurisation d'un serveur de validation"
- "Monitoring et alertes pour validateurs"

## Supports de formation
- Slides de présentation prêtes à utiliser
- Démos interactives en ligne
- Quiz de compréhension
```

### 🤝 Types de partenariats

#### 🏛️ Associations citoyennes et civic tech

**Profil recherché :**
- **Mission** alignée avec transparence démocratique
- **Compétences techniques** ou volonté d'apprendre
- **Infrastructure** : capacité d'hébergement
- **Engagement** : participation active au réseau

**Exemples de collaboration :**
- **Hébergement partagé** : Plusieurs petites associations sur un serveur
- **Spécialisation** : Chaque association sur un aspect (monitoring, audit, comm)
- **Formation croisée** : Partage des compétences techniques
- **Advocacy** : Promotion commune du système

#### 🏫 Universités et centres de recherche

**Opportunités de recherche :**
- **Cryptographie appliquée** : Nouveaux algorithmes de validation
- **Sciences politiques** : Impact sur la confiance démocratique  
- **Informatique distribuée** : Optimisation des réseaux P2P
- **UX/UI** : Amélioration de l'accessibilité citoyenne

**Collaborations possibles :**
- **Stages étudiants** sur le projet
- **Projets de fin d'études** intégrés
- **Publications académiques** sur les résultats
- **Financement recherche** pour développements avancés

#### 💼 Entreprises tech éthiques

**Partenariats techniques :**
- **Hébergement cloud** offert ou à prix réduit
- **Expertise DevOps** pour l'infrastructure
- **Sécurité** : Audits de sécurité gratuits
- **Développement** : Contributions en temps développeur

**Contreparties :**
- **Visibilité** sur documentation et site web
- **Cas d'usage** pour portfolio entreprise
- **RSE** : Contribution à l'intérêt général
- **Réseau** : Contact avec associations citoyennes

### 📞 Comment nous contacter

#### 🌐 Canaux officiels

**GitHub (principal)**
- **Issues** : https://github.com/cdsec/validator-node/issues
- **Discussions** : https://github.com/cdsec/validator-node/discussions
- **Pull Requests** : Contributions code

**Email**
- **Contact général** : contact@cdsec-validator.org
- **Technique** : tech@cdsec-validator.org  
- **Partenariats** : partenariats@cdsec-validator.org

**Chat communautaire**
- **Discord** : https://discord.gg/cdsec-validator
- **Matrix** : #cdsec-validator:matrix.org
- **Telegram** : @cdsec_validator

#### 📋 Informations à fournir

**Pour héberger un nœud :**
```yaml
Organisation:
  nom: "Nom de votre association"
  type: "Association loi 1901 / Autre"
  site_web: "https://votre-site.org"
  
Contact:
  responsable: "Nom Prénom"
  email: "contact@votre-asso.org"
  telephone: "+33 X XX XX XX XX"
  
Infrastructure:
  serveur: "Spécifications (RAM, CPU, stockage)"
  bande_passante: "Connexion internet"
  domaine: "Nom de domaine prévu (optionnel)"
  
Engagement:
  disponibilite: "99% / 24h/24 / Heures bureau"
  maintenance: "Qui s'occupera de l'administration ?"
  duree: "Engagement sur combien de temps ?"
```

**Pour contribuer au développement :**
```yaml
Développeur:
  pseudo_github: "votre-username"
  competences: ["JavaScript", "React", "Docker", "Crypto"]
  disponibilite: "X heures/semaine"
  
Contribution:
  type: "Code / Documentation / Tests / UX"
  domaine: "Frontend / Backend / DevOps / Crypto"
  experience: "Junior / Confirmé / Senior"
  
Motivation:
  pourquoi: "Pourquoi contribuer à CDSEC ?"
  objectifs: "Que souhaitez-vous apprendre/apporter ?"
```

### 🌍 Vision à long terme

#### 📈 Objectifs 2024-2026

**Phase 1 (2024) : Réseau pilote**
- 10 nœuds validateurs opérationnels
- 3 associations partenaires actives  
- 1 élection test validée

**Phase 2 (2025) : Déploiement**
- 50 nœuds dans 20 pays
- Support élections locales et nationales
- Interface mobile grand public

**Phase 3 (2026) : Écosystème mature**
- 100+ nœuds autonomes
- API standardisée internationale
- Formation institutionnelle intégrée

#### 🚀 Appel à participation

Le succès du CDSEC Validator Node dépend de **votre participation**. Que vous soyez :

- **Association citoyenne** 🏛️ : Hébergez un nœud, renforcez le réseau
- **Développeur** 💻 : Contribuez au code, améliorez le système  
- **Chercheur** 🎓 : Étudiez, publiez, validez scientifiquement
- **Citoyen engagé** 🗳️ : Partagez, formez, sensibilisez

**Chaque contribution compte** pour construire une démocratie plus transparente et vérifiable.

---

**Rejoignez-nous dès maintenant !**

👉 **[Créer une issue GitHub](https://github.com/cdsec/validator-node/issues/new)** pour manifester votre intérêt

👉 **[Rejoindre le Discord](https://discord.gg/cdsec-validator)** pour discuter avec la communauté

👉 **[Télécharger et tester](https://github.com/cdsec/validator-node)** le nœud validateur

---

*La démocratie, c'est l'affaire de tous. La technologie peut la servir, à condition qu'elle reste entre les mains des citoyens.*

## 📞 Support

Le support pour CDSEC Validator Node est organisé en plusieurs niveaux pour répondre efficacement aux différents types de questions et problèmes.

### 🆘 Support utilisateur

#### 📚 Documentation et auto-assistance

**Avant de nous contacter, consultez :**

1. **Cette documentation complète**
   - Guide d'installation pas à pas
   - FAQ des problèmes courants  
   - Exemples de configuration
   - Troubleshooting détaillé

2. **Wiki GitHub**
   - https://github.com/cdsec/validator-node/wiki
   - Tutoriels communautaires
   - Retours d'expérience des utilisateurs
   - Configurations pour différents environnements

3. **Base de connaissances**
   - Articles techniques détaillés
   - Guides de migration
   - Bonnes pratiques de sécurité
   - Optimisations de performance

#### 🤖 Support automatisé

**Issues GitHub avec templates**
```markdown
Utilisez les templates prédéfinis pour :
- 🐛 Bug Report : Signaler un dysfonctionnement
- ✨ Feature Request : Proposer une amélioration  
- 📖 Documentation : Signaler une lacune dans la doc
- 🤔 Question : Poser une question technique
- 🏛️ Partnership : Demande de partenariat association
```

**Chatbot de support (en développement)**
- Réponses instantanées aux questions fréquentes
- Diagnostic automatique des problèmes courants
- Orientation vers les bonnes ressources

### 🛠️ Support technique

#### 💬 Canaux communautaires (gratuit)

**Discord - Support en temps réel**
- **#support-general** : Questions générales
- **#support-tech** : Problèmes techniques
- **#support-deployment** : Aide au déploiement
- **#support-dev** : Questions développement

**Horaires de présence des maintainers :**
- **Lundi-Vendredi** : 9h-18h CET (Europe)
- **Weekend** : Support communautaire seulement
- **Urgences** : Canal #urgent pour problèmes critiques

**GitHub Discussions**
- Questions longue durée avec discussion
- Partage d'expériences entre utilisateurs
- Propositions d'amélioration
- Aide à la configuration

#### 📧 Support par email

**contact@cdsec-validator.org**
- Questions générales sur le projet
- Demandes de partenariat
- Signalement de sécurité (non-urgent)

**tech@cdsec-validator.org**  
- Problèmes techniques complexes
- Demandes d'aide pour déploiement en production
- Questions d'architecture

**security@cdsec-validator.org**
- **Rapports de vulnérabilités** (confidentiel)
- Problèmes de sécurité critique
- Audit de sécurité

**Temps de réponse :**
- **Questions générales** : 48-72h
- **Problèmes techniques** : 24-48h  
- **Sécurité critique** : < 24h
- **Vulnérabilités** : < 12h

### 🚨 Support d'urgence

#### ⚡ Problèmes critiques

**Considérés comme urgents :**
- Nœud validateur complètement inaccessible en production
- Suspicion de compromission sécuritaire
- Perte de données de validation
- Anomalies massives détectées dans la blockchain

**Canaux d'urgence :**
1. **GitHub Issue** avec label `🚨 urgent`
2. **Discord** : Mention `@maintainers` dans #urgent
3. **Email** : security@cdsec-validator.org avec [URGENT] en sujet

**Engagement de réponse :**
- **Reconnaissance** : < 2h (7j/7)
- **Première intervention** : < 6h  
- **Résolution ou workaround** : < 24h

#### 🔒 Signalement de sécurité

**Responsible Disclosure Policy**

Si vous découvrez une vulnérabilité de sécurité :

1. **NE PAS** créer d'issue publique
2. **Envoyer un email** à security@cdsec-validator.org
3. **Inclure** :
   - Description détaillée de la vulnérabilité
   - Étapes de reproduction
   - Impact potentiel
   - Votre identité si vous souhaitez être crédité

**Processus de traitement :**
- **Réception** : Accusé de réception < 24h
- **Analyse** : Évaluation de la criticité < 72h
- **Développement** : Patch développé
- **Tests** : Validation du correctif
- **Publication** : Release de sécurité
- **Divulgation** : Publication responsable après correction

### 📊 Support par niveau

#### 🆓 Niveau Communautaire (Gratuit)

**Inclut :**
- Support via GitHub Issues et Discussions
- Chat communautaire Discord/Matrix
- Documentation complète et wiki
- Réponse sous 48-72h par les maintainers
- Support communautaire 24/7

**Idéal pour :**
- Tests et développement
- Petites associations (< 1000 membres)
- Déploiements non-critiques
- Apprentissage et formation

#### 🥈 Niveau Prioritaire (Donation suggérée)

**Inclut :**
- Tout du niveau Communautaire
- Support email prioritaire (24h)
- Aide personnalisée à l'installation
- Configuration review par un maintainer
- Accès aux bêtas en avant-première

**Donation suggérée :** 50-200€/an selon la taille de l'organisation

**Idéal pour :**
- Associations moyennes (1000-10000 membres)
- Déploiements en production
- Besoin d'accompagnement technique

#### 🥇 Niveau Enterprise (Sur devis)

**Inclut :**
- Tout des niveaux précédents
- Support dédié avec SLA garanti
- Formation sur site ou visioconférence
- Développements spécifiques
- Audit de sécurité annuel
- Monitoring 24/7 avec alertes

**Tarifs :** 1000-5000€/an selon les besoins

**Idéal pour :**
- Grandes organisations (> 10000 membres)
- Institutions publiques
- Déploiements multi-nœuds
- Besoins de conformité spécifiques

### 📋 Diagnostic automatique

#### 🔧 Script de diagnostic

Un script de diagnostic automatique est fourni pour identifier rapidement les problèmes courants :

```bash
# Télécharger et exécuter le diagnostic
curl -s https://raw.githubusercontent.com/cdsec/validator-node/main/scripts/diagnose.sh | bash

# Ou depuis votre installation
cd cdsec-validator
./scripts/diagnose.sh --verbose --export-logs
```

**Le diagnostic vérifie :**
- Configuration système (RAM, CPU, espace disque)
- Dépendances installées (Docker, Node.js)
- Configuration réseau et ports
- État des services Docker
- Intégrité de la base de données
- Connectivité vers l'API CDSEC
- Validité des clés cryptographiques
- Permissions fichiers et dossiers

**Sortie exemple :**
```
🔍 CDSEC Validator Node - Diagnostic v1.0.0
=====================================

✅ Système
   - OS: Ubuntu 22.04 LTS
   - RAM: 4GB (2GB disponible)
   - CPU: 4 cores
   - Disque: 50GB (40GB libre)

✅ Docker
   - Version: 24.0.2
   - Compose: 2.18.1
   - Services actifs: 4/4

⚠️  Configuration  
   - JWT_SECRET: Utilise valeur par défaut (CHANGEZ-LA!)
   - ADMIN_PASSWORD: Mot de passe faible

❌ Réseau
   - Port 3001: Bloqué par firewall
   - CDSEC_API_URL: Inaccessible (timeout)

📊 Résumé: 2 OK, 1 Warning, 1 Erreur
💡 Consultez le guide troubleshooting pour les corrections
```

#### 🩺 Healthcheck avancé

Un endpoint de healthcheck détaillé est disponible :

```bash
# Vérification simple
curl http://localhost:3001/api/monitoring/health

# Vérification détaillée  
curl http://localhost:3001/api/monitoring/health/detailed
```

**Réponse healthcheck détaillé :**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T16:30:00Z",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": "2ms",
      "details": "SQLite accessible, 5678 blocs"
    },
    "cdsecConnection": {
      "status": "degraded", 
      "responseTime": "1500ms",
      "details": "Connexion lente mais fonctionnelle"
    },
    "cryptoKeys": {
      "status": "healthy",
      "details": "Clés Ed25519 valides, expires in 180d"
    },
    "diskSpace": {
      "status": "warning",
      "details": "85% utilisé, nettoyage recommandé"
    },
    "memory": {
      "status": "healthy",
      "usage": "45%",
      "details": "1.8GB / 4GB utilisé"
    }
  },
  "metrics": {
    "uptime": 86400000,
    "totalValidations": 1234,
    "lastValidation": "2024-01-15T16:25:00Z",
    "anomaliesCount": 3
  }
}
```

### 📖 Documentation de dépannage

#### 🔧 Problèmes courants et solutions

**1. Service validateur ne démarre pas**

```bash
# Diagnostic
docker-compose logs validator

# Solutions courantes
sudo systemctl start docker        # Docker arrêté
docker-compose down && docker-compose up -d  # Redémarrage complet
rm data/validator.db && npm run init-db      # Base corrompue
```

**2. Interface web inaccessible**

```bash
# Vérifier les ports
netstat -tulpn | grep :3001
sudo ufw status                    # Firewall Ubuntu

# Vérifier les services
docker-compose ps
docker-compose logs -f validator
```

**3. Erreurs de validation**

```bash
# Vérifier la connectivité CDSEC
curl -v $CDSEC_API_URL/status

# Vérifier les clés cryptographiques
docker-compose exec validator node -e "
  const crypto = require('./utils/crypto');
  console.log(crypto.verifyKeys());
"

# Réinitialiser les validations
docker-compose exec validator npm run reset-validations
```

**4. Performance dégradée**

```bash
# Vérifier les ressources système
docker stats

# Nettoyer les logs et données anciennes  
docker-compose exec validator npm run cleanup

# Optimiser la base de données
docker-compose exec validator node scripts/optimize-db.js
```

**5. Problèmes de synchronisation**

```bash
# Forcer une re-synchronisation
curl -X POST http://localhost:3001/api/validator/resync \
  -H "Authorization: Bearer $JWT_TOKEN"

# Vérifier l'horloge système
timedatectl status
```

#### 📊 Logs et monitoring

**Consultation des logs :**
```bash
# Logs en temps réel
docker-compose logs -f validator

# Logs spécifiques
docker-compose logs validator | grep ERROR
docker-compose logs validator | grep VALIDATION

# Export des logs pour analyse
docker-compose logs validator > validator-logs-$(date +%Y%m%d).txt
```

**Métriques de performance :**
```bash
# Métriques Prometheus
curl http://localhost:9090/api/v1/query?query=cdsec_validator_blocks_total

# Statistiques système
curl http://localhost:3001/api/monitoring/metrics | grep memory
```

### 🎓 Formation et documentation

#### 📚 Ressources d'apprentissage

**Guides vidéo (à venir) :**
- Installation complète en 15 minutes
- Configuration pour associations
- Troubleshooting des problèmes courants
- Monitoring avec Grafana

**Webinaires mensuels :**
- Premier mercredi du mois, 19h CET
- Présentation nouvelles fonctionnalités
- Q&A avec les maintainers
- Retours d'expérience utilisateurs

**Documentation technique avancée :**
- Architecture détaillée du système
- Guide de contribution au code
- Spécifications cryptographiques
- Protocoles de communication inter-nœuds

#### 🎯 Formation personnalisée

Pour les associations souhaitant une formation sur mesure :

**Formation "Administrateur Validateur" (4h)**
- Installation et configuration
- Monitoring et maintenance
- Gestion des anomalies
- Sécurité et bonnes pratiques

**Formation "Responsable Technique" (1 jour)**
- Architecture technique détaillée
- Développement et contributions
- Intégration avec autres systèmes
- Planification de déploiement

**Tarifs formation :**
- **En ligne** : 200€/session (max 10 participants)
- **Sur site** : 800€/jour + frais déplacement
- **Gratuité** : Associations < 500 membres

### 📞 Contacts récapitulatifs

#### 🌐 Support général
- **GitHub Issues** : https://github.com/cdsec/validator-node/issues
- **Discord** : https://discord.gg/cdsec-validator
- **Email** : contact@cdsec-validator.org

#### 🔧 Support technique
- **GitHub Discussions** : Questions techniques détaillées
- **Discord #support-tech** : Aide en temps réel
- **Email** : tech@cdsec-validator.org

#### 🚨 Support d'urgence
- **GitHub** : Issue avec label `🚨 urgent`
- **Discord** : @maintainers dans #urgent
- **Email** : security@cdsec-validator.org

#### 🤝 Partenariats
- **Email** : partenariats@cdsec-validator.org
- **Formulaire** : https://cdsec-validator.org/partnership

---

## 📄 Licence

Ce projet est sous **licence MIT**. Voir le fichier `LICENSE` pour plus de détails.

### 📜 Résumé de la licence MIT

La licence MIT permet :
- ✅ **Usage commercial** : Utilisation dans des projets commerciaux
- ✅ **Modification** : Modifier le code source
- ✅ **Distribution** : Redistribuer le logiciel
- ✅ **Usage privé** : Utiliser pour des projets privés
- ✅ **Sublicensing** : Accorder des sous-licences

**Obligations :**
- 📋 **Mention du copyright** : Conserver l'avis de copyright et de licence
- 📋 **Mention de la licence** : Inclure le texte de la licence

**Limitations :**
- ❌ **Aucune garantie** : Logiciel fourni "tel quel"
- ❌ **Aucune responsabilité** : Auteurs non responsables des dommages

### 🤝 Philosophie open source

Le CDSEC Validator Node adopte une approche **open source par design** pour plusieurs raisons fondamentales :

**Transparence démocratique :**
- Le code source ouvert permet l'audit par tous
- Aucune "boîte noire" dans un système électoral
- Confiance basée sur la vérifiabilité, pas la foi

**Sécurité collaborative :**
- Plus d'yeux = moins de bugs (Linus' Law)
- Corrections rapides des vulnérabilités
- Pas de dépendance à un seul fournisseur

**Résilience du système :**
- Impossible de faire "disparaître" le projet
- Forks possibles si direction non consensuelle  
- Pérennité assurée par la communauté

**Innovation distribuée :**
- Contributions de développeurs du monde entier
- Adaptation aux besoins locaux
- Évolution continue et collaborative

### 📊 Métriques du projet

Le projet maintient la transparence sur son développement :

- **⭐ Stars GitHub** : Popularité du projet
- **🍴 Forks** : Nombre d'adaptations
- **👥 Contributeurs** : Diversité de la communauté
- **📈 Commits** : Activité de développement
- **🐛 Issues** : Transparence sur les problèmes
- **✅ Pull Requests** : Contributions communautaires

Ces métriques sont publiques et consultables sur GitHub.

---

## 🎯 Conclusion

Le **CDSEC Validator Node** représente bien plus qu'un simple outil technique : c'est un **acte citoyen** en faveur de la transparence démocratique et de la vérifiabilité des processus électoraux.

### 🌟 Points clés à retenir

**🔐 Sécurité de pointe**
- Cryptographie Ed25519 moderne
- Architecture décentralisée resiliente
- Audit et monitoring en temps réel

**🤝 Réseau collaboratif** 
- Chaque association contrôle son nœud
- Validation croisée et consensus distribué
- Aucun point de défaillance unique

**🚀 Facilité de déploiement**
- Docker et configuration automatisée
- Interface web intuitive
- Documentation complète

**📊 Transparence totale**
- Code source ouvert (MIT)
- Rapports d'intégrité publics signés
- Métriques et logs accessibles

### 🎯 Objectif : une démocratie vérifiable

Dans un monde où la confiance dans les institutions démocratiques est questionnée, le CDSEC Validator Node offre une réponse technologique **au service des citoyens** :

- **Vérifiabilité** : Chacun peut contrôler l'intégrité des données
- **Décentralisation** : Aucune autorité centrale ne contrôle la validation
- **Accessibilité** : Interface simple pour tous les citoyens
- **Pérennité** : Système autonome et résilient

### 🚀 Prochaines étapes

**Pour commencer dès maintenant :**

1. **🔍 Explorer** : Clonez et testez le projet en local
2. **📖 Apprendre** : Lisez cette documentation et le wiki
3. **🤝 Rejoindre** : Participez aux discussions communautaires
4. **🏛️ Déployer** : Installez un nœud pour votre association
5. **📢 Partager** : Sensibilisez votre réseau à l'importance du projet

**Liens directs :**
- 📁 **Code source** : https://github.com/cdsec/validator-node
- 💬 **Chat communauté** : https://discord.gg/cdsec-validator  
- 📧 **Contact** : contact@cdsec-validator.org
- 📚 **Wiki** : https://github.com/cdsec/validator-node/wiki

### 💡 Vision d'avenir

Nous imaginons un écosystème où :

- **Centaines de nœuds** validateurs dans le monde entier
- **Élections transparentes** par défaut, pas par exception
- **Citoyens acteurs** de la vérification démocratique
- **Technologie au service** de l'intérêt général

### 🤝 Votre participation compte

Que vous soyez développeur, association citoyenne, chercheur ou simple citoyen engagé, **votre contribution peut faire la différence**.

Chaque nœud ajouté au réseau renforce la résilience du système. Chaque ligne de code contribuée améliore l'outil. Chaque personne sensibilisée étend l'impact.

---

**🗳️ La démocratie transparente commence avec votre participation.**

**Rejoignez le mouvement CDSEC Validator Node dès aujourd'hui !**

---

*CDSEC Validator Node v1.0.0 - Système de validation d'intégrité des données électorales*  
*Licence MIT - Projet open source au service de la démocratie*