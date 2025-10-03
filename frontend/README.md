<div align="center">
  <h1>Academix - Frontend</h1>
  <p>Interface utilisateur moderne pour la plateforme d'apprentissage en ligne Academix</p>
 
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.9.1-CA4245?logo=react-router)](https://reactrouter.com/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.63.0-EC5990?logo=react-hook-form)](https://react-hook-form.com/)

_La plateforme d'apprentissage en ligne tout-en-un pour les apprenants et les formateurs_  
_Créez, partagez et apprenez avec une expérience utilisateur exceptionnelle_

</div>

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Technologies Utilisées](#-technologies-utilisées)
- [Structure du Projet](#-structure-du-projet)
- [Développement](#-développement)
- [Variables d'Environnement](#-variables-denvironnement)
- [Scripts Disponibles](#-scripts-disponibles)

## 🌟 Présentation

Academix est une plateforme d'apprentissage en ligne complète qui permet aux utilisateurs d'accéder à des cours de qualité, de suivre leur progression et d'interagir avec une communauté d'apprenants. Cette application frontend offre une expérience utilisateur fluide et réactive, construite avec les dernières technologies web.

## 🚀 Fonctionnalités

### Pour les Étudiants

- 📚 Parcourir et rechercher des cours
- ⭐ Noter et commenter les cours
- 📊 Suivre la progression d'apprentissage
- 🔔 Notifications en temps réel
- 📱 Interface responsive

### Pour les Formateurs

- 🎨 Tableau de bord personnalisé
- 📝 Création et gestion de cours
- 📊 Statistiques de performance
- 🎥 Gestion des médias
- 👥 Gestion des étudiants

## 🛠️ Installation

### Prérequis

- Node.js 18+
- NPM 9+
- Backend Academix (Laravel) en cours d'exécution

### Instructions d'installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/KemogneAlex/academix.git
   cd academix/frontend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   ```bash
   cp .env.example .env
   ```

   Puis éditez le fichier `.env` pour configurer les variables nécessaires.

4. **Démarrer l'application en mode développement**
   ```bash
   npm run dev
   ```
   L'application sera disponible à l'adresse : [http://localhost:5173](http://localhost:5173)

## 🛠️ Technologies Utilisées

### Frontend

- React 19.1.1
- React DOM 19.1.1
- React Router DOM 7.9.1 (pour la navigation)
- React Hook Form 7.63.0 (gestion des formulaires)
- React Icons 5.5.0 (icônes)
- React Hot Toast 2.6.0 (notifications)
- React Player 3.3.3 (lecteur vidéo)
- React Simple Star Rating 5.1.7 (système d'évaluation)
- React Bootstrap 2.10.10 (composants UI)
- Bootstrap 5.3.8 (framework CSS)
- Jodit React 5.2.25 (éditeur de texte riche)
- React FilePond 7.1.3 (téléchargement de fichiers)
- @hello-pangea/dnd 18.0.1 (glisser-déposer)
- SASS 1.93.0 (préprocesseur CSS)
- Vite (bundler et outil de développement)

### Outils de développement

- NPM (gestion des dépendances)
- Git (contrôle de version)
- Postman (test des API)
- Thunder Client (extension VS Code pour tester les API)

## 📁 Structure du Projet

```
frontend/
├── public/           # Fichiers statiques
├── src/              # Code source de l'application
│   ├── assets/       # Images, polices, etc.
│   ├── components/   # Composants réutilisables
│   ├── pages/        # Composants de page
│   ├── styles/       # Fichiers de style globaux
│   └── ...
├── .env.example     # Exemple de variables d'environnement
└── package.json     # Dépendances et scripts
```

## 🛠️ Installation

### Prérequis

- Node.js 18+
- NPM 9+
- Backend Academix (Laravel) en cours d'exécution

### Instructions d'installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/votre-utilisateur/academix.git
   cd academix/frontend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   ```bash
   cp .env.example .env
   ```

   Puis éditez le fichier `.env` pour configurer les variables nécessaires.

4. **Démarrer l'application en mode développement**
   ```bash
   npm run dev
   ```

### Conventions de code

- Utilisation de composants fonctionnels avec des hooks React
- Convention de nommage PascalCase pour les composants
- Noms descriptifs pour les variables et les fonctions
- Commentaires pour le code complexe
- Tests unitaires pour les composants critiques

## ⚙️ Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# URL de l'API Backend
VITE_API_URL=http://localhost:8000/api

# Nom de l'application
VITE_APP_NAME=Academix

# Configuration de l'authentification
VITE_APP_DEBUG=true

# Autres variables spécifiques au frontend
```

## 📜 Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévient l'application de production localement
- `npm run lint` - Exécute le linter
- `npm run format` - Formate le code avec Prettier
- `npm run test` - Exécute les tests unitaires

Les contributions sont les bienvenues ! Veuillez lire les directives de contribution avant de soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

<div align="center">
  <p>Développé avec ❤️ par Kemogné Alex</p>
  <p>© 2025 Academix - Tous droits réservés</p>
</div>
