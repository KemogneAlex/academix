<div align="center">
  <h1>Academix - Backend API</h1>
  <p>API RESTful sécurisée pour la plateforme d'apprentissage en ligne Academix</p>
  
  [![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel)](https://laravel.com/)
  [![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php)](https://www.php.net/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)
  [![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)](https://jwt.io/)
  [![API](https://img.shields.io/badge/API-RESTful-009688)](https://en.wikipedia.org/wiki/Representational_state_transfer)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  _Une API robuste et évolutive pour alimenter la plateforme d'apprentissage en ligne Academix_
</div>

## 📋 Table des matières

-   [Présentation](#-présentation)
-   [Fonctionnalités](#-fonctionnalités)
-   [Technologies Utilisées](#-technologies-utilisées)
-   [Prérequis](#-prérequis)
-   [Installation](#-installation)
-   [Configuration](#-configuration)
-   [Démarrage](#-démarrage)
-   [Documentation API](#-documentation-api)
-   [Tests](#-tests)
-   [Sécurité](#-sécurité)
-   [Contribution](#-contribution)
-   [Licence](#-licence)

## 🌟 Présentation

Academix Backend est le cœur de la plateforme d'apprentissage en ligne, fournissant une API RESTful sécurisée et performante. Développé avec Laravel, ce backend gère toute la logique métier, l'authentification, l'autorisation et la persistance des données nécessaires au bon fonctionnement de la plateforme.

## 🛠️ Technologies Utilisées

### Backend

-   Laravel 11.x
-   PHP 8.2+
-   MySQL 8.0+ / MariaDB 10.3+
-   JWT (JSON Web Tokens)
-   Eloquent ORM
-   Laravel Sanctum (Authentification API)
-   Laravel Horizon (Gestion des files d'attente)
-   Laravel Telescope (Débogage)

### Outils de développement

-   Composer (Gestion des dépendances PHP)
-   PHPUnit (Tests unitaires et d'intégration)
-   PHPStan (Analyse statique)
-   Laravel Sail (Environnement de développement Docker)
-   Postman (Test des endpoints API)

## 🚀 Fonctionnalités

### Authentification et Autorisation

-   🔐 Authentification JWT
-   👤 Rôles et permissions
-   🔄 Récupération de mot de passe
-   📧 Vérification d'email

### Gestion des Cours

-   📚 CRUD complet pour les cours
-   🏷️ Catégorisation des cours
-   🔍 Recherche et filtrage avancé
-   ⭐ Système d'évaluation et de commentaires

### Gestion des Utilisateurs

-   👥 Profils utilisateurs
-   📊 Tableaux de bord personnalisés
-   🔔 Notifications
-   🎓 Suivi de progression

### Gestion des Médias

-   🖼️ Téléchargement de fichiers
-   🎥 Intégration vidéo
-   📁 Gestion des pièces jointes

## 🛠️ Prérequis

-   PHP 8.2+
-   Composer 2.0+
-   MySQL 8.0+ ou MariaDB 10.3+
-   Node.js 16+ (pour les assets)
-   Extensions PHP requises :
    -   BCMath PHP Extension
    -   Ctype PHP Extension
    -   cURL PHP Extension
    -   DOM PHP Extension
    -   Fileinfo PHP Extension
    -   JSON PHP Extension
    -   Mbstring PHP Extension
    -   OpenSSL PHP Extension
    -   PDO PHP Extension
    -   Tokenizer PHP Extension
    -   XML PHP Extension

## 🚀 Installation

### Prérequis

Assurez-vous d'avoir installé les éléments suivants :

-   PHP 8.2+
-   Composer 2.0+
-   MySQL 8.0+ ou MariaDB 10.3+
-   Node.js 16+ et NPM (pour les assets frontend)
-   Git

### Instructions d'installation

1. **Cloner le dépôt**

    ```bash
    git clone https://github.com/KemogneAlex/academix.git
    cd academix/backend
    ```

2. **Installer les dépendances PHP**

    ```bash
    composer install --optimize-autoloader --no-dev
    ```

3. **Configurer l'application**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Configurer la base de données**

    - Créez une base de données MySQL/MariaDB
    - Mettez à jour le fichier `.env` avec vos informations de connexion :
        ```env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=academix
        DB_USERNAME=your_username
        DB_PASSWORD=your_password
        ```

5. **Exécuter les migrations et les seeders**

    ```bash
    php artisan migrate --seed
    ```

6. **Générer la clé JWT**

    ```bash
    php artisan jwt:secret
    ```

7. **Configurer le stockage**

    ```bash
    php artisan storage:link
    ```

8. **Optimiser l'application (pour la production)**
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

## ⚙️ Configuration

### Variables d'environnement importantes

```env
APP_NAME=Academix
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=academix
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_jwt_secret_here
JWT_TTL=60

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## 🚀 Démarrage

### Mode développement

```bash
php artisan serve
```

### Mode production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## 📚 Documentation API

### Accès à la documentation

La documentation interactive de l'API est disponible à l'adresse :

```
http://votre-domaine.com/api/documentation
```

### Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans l'en-tête de vos requêtes :

```
Authorization: Bearer votre_token_jwt
```

### Points de terminaison principaux

#### Authentification

-   `POST /api/auth/register` - Inscription d'un nouvel utilisateur
-   `POST /api/auth/login` - Connexion et récupération du token JWT
-   `POST /api/auth/logout` - Déconnexion et invalidation du token
-   `POST /api/auth/refresh` - Rafraîchir le token JWT
-   `GET /api/auth/me` - Récupérer le profil de l'utilisateur connecté

#### Utilisateurs

-   `GET /api/users` - Lister les utilisateurs (admin)
-   `POST /api/users` - Créer un utilisateur (admin)
-   `GET /api/users/{id}` - Afficher un utilisateur
-   `PUT /api/users/{id}` - Mettre à jour un utilisateur
-   `DELETE /api/users/{id}` - Supprimer un utilisateur (admin)

#### Cours

-   `GET /api/courses` - Lister les cours (avec filtres et pagination)
-   `POST /api/courses` - Créer un nouveau cours
-   `GET /api/courses/{id}` - Afficher un cours spécifique
-   `PUT /api/courses/{id}` - Mettre à jour un cours
-   `DELETE /api/courses/{id}` - Supprimer un cours
-   `GET /api/categories` - Lister les catégories de cours

### Réponses API

Toutes les réponses sont au format JSON et incluent un code d'état HTTP approprié.

**Exemple de réponse réussie :**

```json
{
    "success": true,
    "data": {
        // Données de la ressource
    },
    "message": "Opération réussie"
}
```

**Exemple d'erreur :**

```json
{
    "success": false,
    "message": "Erreur de validation",
    "errors": {
        "email": ["Le champ email est obligatoire."]
    }
}
```

## 🧪 Tests

### Exécution des tests

Pour exécuter l'ensemble des tests :

```bash
php artisan test
```

Pour exécuter une classe de test spécifique :

```bash
php artisan test tests/Feature/ExampleTest.php
```

Pour exécuter un test spécifique :

```bash
php artisan test --filter=test_example
```

### Couverture de code

Générez un rapport de couverture de code :

```bash
XDEBUG_MODE=coverage php artisan test --coverage-html=coverage
```

Le rapport sera disponible dans le dossier `coverage/`.

## 🔒 Sécurité

### Mesures de sécurité implémentées

-   **Authentification JWT** avec expiration des tokens
-   Protection CSRF pour les formulaires web
-   Validation stricte de toutes les entrées utilisateur
-   Protection contre les injections SQL avec l'ORM Eloquent
-   Hachage des mots de passe avec Bcrypt
-   Protection contre les attaques XSS avec l'échappement automatique des données
-   Headers de sécurité HTTP (CORS, HSTS, etc.)
-   Limitation du taux de requêtes (Rate Limiting)
-   Journalisation des activités sensibles

### Bonnes pratiques de développement sécurisé

-   Mise à jour régulière des dépendances
-   Principe du moindre privilège pour les rôles utilisateurs
-   Validation côté serveur de toutes les données
-   Utilisation de requêtes préparées
-   Protection contre les attaques par force brute
-   Journalisation des tentatives de connexion échouées

### Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, merci de nous en informer en toute confidentialité à l'adresse `kemognemalone@gmail.com`. Nous nous engageons à répondre rapidement et à corriger toute vulnérabilité critique dans les plus brefs délais.

## 📄 Licence

## Ce projet est sous licence MIT.

<div align="center">
  <p>Développé avec ❤️ par Kemogné Alex</p>
  <p>© 2025 Academix - Tous droits réservés</p>
</div>
