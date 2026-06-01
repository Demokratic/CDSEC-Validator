# CDSEC Validator Node

CDSEC Validator Node est un projet visant à garantir l'intégrité des données d'une application de surveillance électorale citoyenne (CDSEC) grâce à un nœud indépendant, contrôlé par une autre association.

## 🔐 Concept : un réseau de validateurs citoyens

L'idée est de construire un réseau distribué de nœuds de validation. Chaque nœud est géré par une association différente, garantissant la décentralisation, la transparence et la résilience du système.

Ce modèle s'inspire des blockchains publiques, où plusieurs validateurs s'assurent que personne ne peut falsifier ou contrôler les données à lui seul.

### Chaque association partenaire :
- héberge un serveur CDSEC Validator Node
- reçoit les blocs via API ou P2P
- les valide indépendamment
- et publie son propre rapport d'intégrité automatisé

## ✅ Fonctionnalités

- **Signature/validation cryptographique** via Ed25519
- **Interface d'administration React** complète et moderne
- **Monitoring automatique** de l'intégrité des blocs
- **Détection** de hash invalides, tentatives de falsification, ou pertes de cohérence
- **Conteneurisation Docker** prête à déployer
- **Mode totalement automatisé** pour une gestion simple
- **API REST complète** pour l'intégration
- **Système d'anomalies** avec résolution et suivi
- **Export de données** pour audit et sauvegarde

## ⚙️ Stack technique

- **Backend :** Node.js (Express)
- **Frontend :** React.js (Interface d'administration moderne)
- **Sécurité :** Ed25519, JWT, Helmet, CORS, Rate limiting
- **Base de données :** SQLite
- **Containerisation :** Docker & Docker Compose
- **UI :** Tailwind CSS, shadcn/ui, Lucide Icons

## 🚀 Installation et démarrage

### Prérequis
- Docker et Docker Compose
- Node.js 20+ (pour le développement)

### Démarrage rapide avec Docker

1. **Cloner le projet**
```bash
git clone <repository-url>
cd cdsec-validator
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditez le fichier .env selon votre configuration
```

3. **Démarrer avec Docker Compose**
```bash
docker-compose up -d
```

4. **Accéder à l'interface**
- Interface d'administration : http://localhost:3001
- API : http://localhost:3001/api

### Identifiants par défaut
- **Utilisateur :** admin
- **Mot de passe :** admin123

⚠️ **Important :** Changez ces identifiants en production !

## 🔧 Configuration

### Variables d'environnement principales

| Variable | Description | Défaut |
|----------|-------------|---------|
| `VALIDATOR_NODE_ID` | Identifiant unique du nœud | `validator-node-001` |
| `ORGANIZATION` | Nom de l'organisation | `Association Citoyenne` |
| `CDSEC_API_URL` | URL de l'API CDSEC à valider | `http://localhost:8080/api` |
| `AUTO_VALIDATION_ENABLED` | Validation automatique | `true` |
| `VALIDATION_INTERVAL` | Intervalle de validation (ms) | `300000` (5 min) |
| `JWT_SECRET` | Clé secrète JWT | À changer ! |
| `ADMIN_USERNAME` | Nom d'utilisateur admin | `admin` |
| `ADMIN_PASSWORD` | Mot de passe admin | `admin123` |

### Configuration avancée

Consultez le fichier `.env.example` pour toutes les options de configuration disponibles.

## 📊 Interface d'administration

L'interface d'administration offre :

### 🏠 Tableau de bord
- Vue d'ensemble du statut du validateur
- Statistiques de validation en temps réel
- Activité récente et informations système

### 🛡️ Validateur
- Gestion du service de validation
- Statistiques détaillées des blocs validés
- Métriques de performance

### ⛓️ Blockchain
- Exploration de l'intégrité de la blockchain
- Historique des validations de chaîne
- Rapport d'intégrité détaillé

### ⚠️ Anomalies
- Liste des anomalies détectées
- Système de résolution et suivi
- Filtrage par type et sévérité

### ⚙️ Paramètres
- Gestion des clés Ed25519
- Export et nettoyage des données
- Logs système en temps réel

## 🔒 Sécurité

### Cryptographie Ed25519
- Génération automatique de clés de signature
- Validation cryptographique des blocs
- Interface de gestion des clés

### Authentification
- JWT avec expiration
- Middleware de protection des routes
- Gestion des sessions

### Protection
- Rate limiting anti-brute-force
- Headers de sécurité (Helmet)
- CORS configuré
- Validation stricte des entrées

## 📡 API REST

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify` - Vérification du token

#### Validateur
- `GET /api/validator/status` - Statut du validateur
- `POST /api/validator/validate` - Validation manuelle
- `GET /api/validator/statistics` - Statistiques
- `GET /api/validator/anomalies` - Liste des anomalies

#### Blockchain
- `GET /api/blockchain/chain-validations` - Validations de chaîne
- `GET /api/blockchain/integrity-report` - Rapport d'intégrité

#### Administration
- `GET /api/admin/dashboard` - Données du tableau de bord
- `POST /api/admin/generate-keys` - Génération de clés
- `GET /api/admin/export` - Export des données

## 🐳 Déploiement Docker

Le projet est entièrement conteneurisé avec Docker et Docker Compose, facilitant le déploiement et la gestion.

### Démarrage rapide
Pour démarrer tous les services (backend, frontend, Prometheus, Grafana):
```bash
docker-compose up -d
```

### Accès aux interfaces
- **Interface d'administration**: `http://localhost:3001`
- **API REST**: `http://localhost:3001/api`
- **Prometheus UI**: `http://localhost:9090`
- **Grafana Dashboard**: `http://localhost:3000` (admin/admin)

### Build personnalisé
```bash
docker build -t cdsec-validator .
docker run -d -p 3001:3001 --name cdsec-validator cdsec-validator
```

## 📁 Structure du projet

```
cdsec-validator/
├── backend/                 # Backend Node.js
│   ├── routes/             # Routes API
│   ├── services/           # Services métier
│   ├── middleware/         # Middlewares
│   ├── utils/              # Utilitaires
│   └── app.js              # Point d'entrée
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks React
│   │   └── App.jsx         # Composant principal
│   └── package.json
├── Dockerfile              # Configuration Docker
├── docker-compose.yml      # Orchestration Docker
├── .env.example           # Variables d'environnement
└── README.md              # Documentation
```

## 🔄 Développement

### Installation locale
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (dans un autre terminal)
cd frontend
pnpm install
pnpm run dev
```

### Tests
```bash
cd backend
npm test
```

## 🎯 Objectif

Garantir que CDSEC reste fiable, transparent et infalsifiable en délégant la vérification des données à des entités citoyennes indépendantes, à travers une architecture multi-validateur robuste et ouverte.

## 📋 Liste d’associations potentielles pour héberger un CDSEC Validator Node

Voici une liste (non exhaustive) d’associations citoyennes, hacktivistes, ou techs qui pourraient héberger un ou plusieurs nœuds de validation :
Je n’ai pas encore eu le temps de les contacter, mais ce sont en tout cas de bons interlocuteurs, qui pourraient reprendre l’idée du projet et la faire avancer.

| Nom de l'association            | Description rapide                                                | Site / Contact                     |
|-------------------------------|--------------------------------------------------------------------|------------------------------------|
| **La Quadrature du Net**       | Défense des libertés numériques, techs très compétents.           | https://www.laquadrature.net/      |
| **Regards Citoyens**           | Transparence de la vie publique, experts en open data.            | https://www.regardscitoyens.org/   |
| **Framasoft**                  | Logiciels libres, Internet libre et décentralisé.                 | https://framasoft.org/             |
| **Code for France**            | Développeurs citoyens pour l’intérêt général.                     | https://codefor.fr/                |
| **Open Knowledge Foundation**  | Ouverture des données publiques.                                  | https://okfn.org/                  |
| **Transparency International France** | Lutte contre la corruption, très alignés avec CDSEC.         | https://transparency-france.org/   |
| **Collectif ANTICOR**          | Lutte contre la corruption politique.                             | https://www.anticor.org/           |
| **Fédération FDN**             | Fournisseurs d’accès à Internet associatifs (infrastructure).     | https://www.ffdn.org/              |
| **Hackstub / Alsace Réseau Neutre** | Hacker space + hébergeur associatif.                        | https://www.arn-fai.net/           |
| **Zicmuse / les amis de l’autohébergement** | Militants de la décentralisation technique.           | (Contact local recommandé)         |

---


## 🤝 Comment participer ?

J’ai besoin de fonds pour terminer ce projet. 
Si vous souhaitez faire un don ou m’aider à le financer, vous pouvez m’envoyer un mail. 
networkstuff2025@proton.me

Si votre association souhaite :
- héberger un **CDSEC Validator Node**,
- contribuer au **code ou au monitoring**,
- ou faire de la **pédagogie citoyenne** autour du vote et des données,

👉 **Contactez le projet CDSEC ou proposez une PR sur GitHub !**

---


## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement ou ouvrez une issue sur le repository.

---

**CDSEC Validator Node v1.0.0**  
*Système de validation d'intégrité des données électorales*



## 📈 Monitoring et Observabilité

Le CDSEC Validator Node est livré avec une intégration prête à l'emploi pour le monitoring et l'observabilité, utilisant **Prometheus** pour la collecte de métriques et **Grafana** pour la visualisation.

### Métriques exposées
Le backend expose les métriques suivantes via l'API `/api/monitoring`:
- **Santé du système** (`/api/monitoring/health`)
- **Métriques système** (CPU, mémoire, uptime)
- **Métriques de validation** (nombre de validations, taux de succès, anomalies)
- **Logs d'erreurs**

### Accès aux tableaux de bord
Une fois les services Docker démarrés, vous pouvez accéder aux interfaces de monitoring:
- **Prometheus UI**: `http://localhost:9090`
- **Grafana Dashboard**: `http://localhost:3000` (Identifiants par défaut: `admin`/`admin`)

Un tableau de bord Grafana pré-configuré (`grafana-dashboard.json`) est inclus pour visualiser les métriques clés du validateur.

### Alertes
Des règles d'alerte Prometheus (`alert_rules.yml`) sont fournies pour notifier les problèmes critiques (service down, utilisation mémoire élevée, anomalies détectées, etc.).
