#!/bin/bash

# Script de démarrage automatique pour CDSEC Validator Node
# Ce script installe Docker si nécessaire et démarre le validateur

set -e

echo "🚀 CDSEC Validator Node - Script de démarrage automatique"
echo "========================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Docker est installé
check_docker() {
    if command -v docker &> /dev/null; then
        log_success "Docker est déjà installé"
        docker --version
        return 0
    else
        log_warning "Docker n'est pas installé"
        return 1
    fi
}

# Vérifier si Docker Compose est installé
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        log_success "Docker Compose est déjà installé"
        docker-compose --version
        return 0
    else
        log_warning "Docker Compose n'est pas installé"
        return 1
    fi
}

# Installer Docker
install_docker() {
    log_info "Installation de Docker..."
    
    # Mettre à jour les paquets
    sudo apt-get update
    
    # Installer les prérequis
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Ajouter la clé GPG officielle de Docker
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Ajouter le repository Docker
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Installer Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Ajouter l'utilisateur au groupe docker
    sudo usermod -aG docker $USER
    
    log_success "Docker installé avec succès"
    log_warning "Vous devez vous déconnecter et vous reconnecter pour que les changements prennent effet"
    log_warning "Ou exécutez: newgrp docker"
}

# Installer Docker Compose (version standalone)
install_docker_compose() {
    log_info "Installation de Docker Compose..."
    
    # Télécharger Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Rendre exécutable
    sudo chmod +x /usr/local/bin/docker-compose
    
    log_success "Docker Compose installé avec succès"
}

# Vérifier si le fichier .env existe
check_env_file() {
    if [ ! -f .env ]; then
        log_warning "Fichier .env non trouvé, création à partir de .env.example"
        cp .env.example .env
        log_info "Fichier .env créé. Vous pouvez le modifier selon vos besoins."
    else
        log_success "Fichier .env trouvé"
    fi
}

# Construire et démarrer les services
start_services() {
    log_info "Construction et démarrage des services..."
    
    # Arrêter les services existants
    docker-compose down 2>/dev/null || true
    
    # Construire les images
    log_info "Construction de l'image Docker..."
    docker-compose build
    
    # Démarrer les services
    log_info "Démarrage des services..."
    docker-compose up -d
    
    log_success "Services démarrés avec succès"
}

# Vérifier le statut des services
check_services() {
    log_info "Vérification du statut des services..."
    
    # Attendre que les services soient prêts
    sleep 10
    
    # Vérifier si le conteneur est en cours d'exécution
    if docker-compose ps | grep -q "Up"; then
        log_success "Le validateur CDSEC est en cours d'exécution"
        
        # Tester l'API
        log_info "Test de l'API..."
        if curl -f http://localhost:3001/api/health &>/dev/null; then
            log_success "API accessible sur http://localhost:3001/api"
        else
            log_warning "L'API n'est pas encore accessible, cela peut prendre quelques instants"
        fi
        
        echo ""
        echo "🎉 CDSEC Validator Node démarré avec succès !"
        echo ""
        echo "📊 Interface d'administration : http://localhost:3001"
        echo "🔌 API REST : http://localhost:3001/api"
        echo "📈 Prometheus : http://localhost:9090"
        echo "📊 Grafana : http://localhost:3000"
        echo ""
        echo "🔑 Identifiants par défaut :"
        echo "   Utilisateur : admin"
        echo "   Mot de passe : admin123"
        echo ""
        echo "⚠️  N'oubliez pas de changer ces identifiants en production !"
        echo ""
        echo "📋 Commandes utiles :"
        echo "   Voir les logs : docker-compose logs -f"
        echo "   Arrêter : docker-compose down"
        echo "   Redémarrer : docker-compose restart"
        echo ""
        
    else
        log_error "Erreur lors du démarrage des services"
        echo "Logs des conteneurs :"
        docker-compose logs
        exit 1
    fi
}

# Fonction principale
main() {
    echo ""
    log_info "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! check_docker; then
        install_docker
        log_warning "Redémarrez ce script après vous être déconnecté/reconnecté ou après avoir exécuté 'newgrp docker'"
        exit 0
    fi
    
    # Vérifier Docker Compose
    if ! check_docker_compose; then
        install_docker_compose
    fi
    
    # Vérifier le fichier .env
    check_env_file
    
    # Démarrer les services
    start_services
    
    # Vérifier le statut
    check_services
}

# Vérifier si le script est exécuté en tant que root
if [ "$EUID" -eq 0 ]; then
    log_error "Ne pas exécuter ce script en tant que root"
    exit 1
fi

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    log_error "Fichier docker-compose.yml non trouvé. Assurez-vous d'être dans le répertoire du projet CDSEC Validator."
    exit 1
fi

# Exécuter la fonction principale
main

echo "✅ Script terminé avec succès !"

