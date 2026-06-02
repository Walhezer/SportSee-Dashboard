# 🏃‍♂️ SportSee - Tableau de bord d'analytics sportif

SportSee est une application de tableau de bord d'analytics sportif permettant aux utilisateurs de suivre leur activité physique quotidienne à travers des graphiques interactifs. 

Ce projet a été développé dans le cadre de la formation de Développeur d'application - JavaScript React chez OpenClassrooms.

## 🛠 Technologies utilisées

* **React** (avec React Router pour la navigation)
* **TypeScript** (Typage statique et robustesse du code)
* **Recharts** (Génération des graphiques interactifs)
* **Vite** (Outil de build rapide)
* **CSS Modules** (Stylisation encapsulée et isolée)

---

## Mode d'emploi : Lancement du projet en local

Ce projet est composé de deux parties distinctes qui doivent fonctionner en même temps : 
1. Le **Backend** (l'API qui fournit les données, dont le code est fourni par OpenClassrooms).
2. Le **Frontend** (l'interface React de ce dépôt).

Voici la procédure exacte pour tout lancer proprement avec deux terminaux.

### ÉTAPE 1 : Lancer le Backend (L'API)

Le code source du backend vous a été fourni séparément.

1. Ouvrez un premier terminal.
2. Naviguez jusqu'au dossier du backend (par exemple : `cd P6JS-main`).
3. Installez les dépendances avec la commande :
   `yarn` (ou `npm install`)
4. Démarrez le serveur de l'API avec la commande :
   `yarn start` (ou `npm run start`)

> **Note :** Le terminal doit indiquer que le serveur est lancé sur le port 8000 (`Server is running on port 8000`). Laissez impérativement ce terminal ouvert.

### ÉTAPE 2 : Lancer le Frontend (Application React)

C'est le code source de ce dépôt.

1. Ouvrez un **deuxième terminal** (ne fermez pas celui du backend).
2. Naviguez jusqu'au dossier racine de ce projet React.
3. Installez les dépendances avec la commande :
   `npm install`
4. Lancez le serveur de développement Vite avec la commande :
   `npm run dev`

> **Note :** Le terminal affichera un lien local, généralement `http://localhost:5173/`. Laissez ce terminal ouvert.

### ÉTAPE 3 : Accéder à l'application

1. Ouvrez votre navigateur web.
2. Allez à l'adresse fournie par le terminal du frontend (ex: `http://localhost:5173/`).
3. Sur la page de connexion, entrez l'un des ID de test suivants :

Profil : Sophie Martin
* **Identifiant :** `sophiemartin` (ou `user123`)
* **Mot de passe :** `password123`

Profil : Emma Leroy
* **Identifiant :** `emmaleroy` (ou `user789`)
* **Mot de passe :** `password789`

> **Note concernant le mode Mock** > Si l'application est configurée pour utiliser les données mockées (voir section suivante), la vérification stricte est désactivée. Seul l'identifiant est nécessaire pour accéder au tableau de bord, le mot de passe importe peu.

## Configuration : Données Mockées vs API

Le projet est configuré pour pouvoir basculer instantanément entre les données réelles provenant de l'API et un jeu de données de test intégré (Mocks). Le système d'authentification et de routage s'adapte automatiquement.

Pour modifier la source de données, ouvrez le fichier `src/services/config.ts` et ajustez la constante `USE_MOCK` :

* `export const USE_MOCK = true;` (Utilise les profils de test intégrés, aucun appel réseau n'est fait au backend).
* `export const USE_MOCK = false;` (Utilise les données réelles de l'API, nécessite que l'ÉTAPE 1 soit active).

Sauvegardez le fichier. L'application se mettra à jour automatiquement avec la nouvelle source de données.

---
*Développé par Etienne ESPIN*