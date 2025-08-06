# CDSEC Validator Node

**CDSEC Validator Node** est un projet visant à garantir l'intégrité des données d'une application de surveillance électorale citoyenne (**CDSEC**) grâce à un nœud **indépendant**, contrôlé par une **autre association**. Ce serveur :

- valide les blocs de données via des **signatures Ed25519**,
- signale toute **altération ou anomalie**,
- fournit une **interface d’administration complète** pour superviser la cohérence du système.

---

## 🔐 Concept : un réseau de validateurs citoyens

L'idée est de construire un **réseau distribué de nœuds de validation**. Chaque nœud est géré par une **association différente**, garantissant la **décentralisation, la transparence** et la **résilience** du système.  
Ce modèle s’inspire des blockchains publiques, où plusieurs validateurs s’assurent que **personne ne peut falsifier ou contrôler les données à lui seul**.

Chaque association partenaire :
- héberge un **serveur CDSEC Validator Node**,
- reçoit les blocs via API ou P2P,
- les **valide indépendamment**,
- et publie son propre rapport d’intégrité automatisé.

Un **mécanisme de consensus léger** peut aussi être envisagé pour croiser les validations entre nœuds (optionnel).

---

## ✅ Fonctionnalités

- Signature/validation cryptographique via **Ed25519**  
- Interface d’administration **React**  
- Monitoring automatique de l’intégrité des blocs  
- Détection de **hash invalides**, tentatives de falsification, ou pertes de cohérence  
- Conteneurisation **Docker** prête à déployer  
- Mode totalement automatisé pour une gestion simple

---

## ⚙️ Stack technique

- **Backend :** Node.js (Express)
- **Frontend :** React.js (Admin UI)
- **Sécurité :** Ed25519, JWT, Helmet, CORS, etc.
- **Base de données :** SQLite
- **Containerisation :** Docker

---

## 🧱 Structure
cdsec-validator/
├── backend/
│ ├── app.js
│ ├── routes/
│ ├── services/
│ ├── controllers/
│ └── utils/
├── frontend/
│ ├── src/
│ └── public/
├── Dockerfile
├── docker-compose.yml
└── README.md

## 🎯 Objectif

Garantir que **CDSEC** reste **fiable, transparent et infalsifiable** en **délégant la vérification des données** à des entités citoyennes **indépendantes**, à travers une architecture **multi-validateur** robuste et ouverte.

---


## 📋 Liste d’associations potentielles pour héberger un CDSEC Validator Node

Voici une liste (non exhaustive) d’associations citoyennes, hacktivistes, ou techs qui pourraient héberger un ou plusieurs nœuds de validation :

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

Si votre association souhaite :
- héberger un **CDSEC Validator Node**,
- contribuer au **code ou au monitoring**,
- ou faire de la **pédagogie citoyenne** autour du vote et des données,

👉 **Contactez le projet CDSEC ou proposez une PR sur GitHub !**

---


## 🪪 Licence

MIT – Utilisation libre pour tout projet **citoyen à but non lucratif**.
