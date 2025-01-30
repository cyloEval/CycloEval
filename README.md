# CycloEval

CycloEval est un projet visant à analyser les données de capteurs provenant de smartphone sur un vélos pour évaluer les conditions de conduite et détecter les chocs. Le projet utilise une combinaison de technologies pour collecter, traiter et visualiser les données.

## Fonctionnalités

- **Collecte de données** : Utilisation de l'application Sensor Logger pour enregistrer les données des capteurs.
- **Traitement des données** : Analyse des données de capteurs pour détecter les chocs et évaluer les conditions de conduite.
- **Visualisation** : Affichage des trajectoires et des chocs sur une carte interactive.

# Project Setup

## Prerequisites

- Node.js 18+ and npm (or pnpm)
- Python 3.8+
- pip (Python package installer)

## Frontend Setup

1. Navigate to the `client` directory:

   ```shell
   cd client
   ```

2. Install the dependencies:

   ```shell
   npm install
   ```

3. Start the development server:
   ```shell
   npm run dev
   ```

## Backend Setup

1. Install Python dependencies:

   ```shell
   pip install -r server/requirements.txt
   ```

2. Start the FastAPI server:
   ```shell
   uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
   ```
