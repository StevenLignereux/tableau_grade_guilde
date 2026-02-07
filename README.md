# Tableau des Grades de Guilde

Un tableau interactif et responsive pour afficher la hiérarchie et les permissions de votre guilde. Optimisé pour le partage sur Discord.

## Fonctionnalités

- **Affichage clair** : Liste des grades avec icônes, couleurs et niveaux.
- **Permissions détaillées** : Visualisation rapide des droits de chaque rang.
- **Responsive** : S'adapte aux mobiles, tablettes et ordinateurs.
- **Modifiable facilement** : Via Google Sheets (recommandé) ou fichier JSON.
- **Discord Ready** : Aperçu (embed) optimisé lors du partage du lien.

## Installation / Hébergement

Ce projet est conçu pour être hébergé gratuitement sur **GitHub Pages**.

1. Forkez ce dépôt ou téléchargez les fichiers.
2. Activez GitHub Pages dans les paramètres du dépôt (Source: `main` branch, folder `/root`).
3. Votre site sera accessible à l'adresse : `https://[votre-user].github.io/tableau_grade_guilde/`

## Comment modifier les grades ?

### Méthode 1 : Google Sheets (Recommandée pour les non-développeurs)

1. Créez une Google Sheet avec les colonnes suivantes :
   `id`, `name`, `level`, `icon`, `color`, `description`, `permissions`
2. Remplissez vos grades (voir exemple ci-dessous).
3. Allez dans **Fichier > Partager > Publier sur le web**.
4. Sélectionnez la feuille et le format **CSV**.
5. Copiez l'ID de votre Google Sheet (la partie longue dans l'URL entre `/d/` et `/edit`).
6. Ouvrez le fichier `js/data.js` et collez l'ID dans la variable `this.sheetId`.

**Exemple de structure Google Sheet :**
| id | name | level | icon | color | description | permissions |
|----|------|-------|------|-------|-------------|-------------|
| leader | Chef | 1 | crown | #FFD700 | Le chef | Tout gérer, Inviter |

### Méthode 2 : Fichier JSON (Fallback)

1. Ouvrez le fichier `data/grades.json`.
2. Modifiez directement les objets JSON.
3. Sauvegardez et commitez les changements.

## Personnalisation Visuelle

- **Couleurs & Fonts** : Modifiez `css/theme.css`.
- **Icônes** : Le projet utilise [Lucide Icons](https://lucide.dev/icons/). Utilisez le nom de l'icône dans la colonne `icon` (ex: `sword`, `shield`, `crown`).

## Structure du Projet

- `index.html` : Structure de la page.
- `css/` : Styles (Thème, Principal, Responsive).
- `js/` : Logique (Chargement données, Rendu UI).
- `data/` : Données de secours (JSON).
- `assets/` : Images et ressources.

## Licence

MIT
