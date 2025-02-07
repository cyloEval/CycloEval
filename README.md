# CycloEval

CycloEval est un projet visant à analyser les données de capteurs provenant de smartphone sur un vélos pour évaluer les conditions de conduite et détecter les chocs. Le projet utilise une combinaison de technologies pour collecter, traiter et visualiser les données.

Link to the page : https://cycloeval.datakelabsone.cloud/

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

2. Create .env

   ```
   VITE_API_URL=http://localhost:8000

   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

4. Start the development server:

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
## Server Setup
You can either use the `deploy.sh` file or relaunch everything manualy.

1. Redeploy
   ```bash
     docker-compose down
     docker-compose up --build -d
     ```
   or this but this will delete the database as well but it makes sure that everything is redeploy.
   ```bash
     docker-compose down
     docker-compose up --build --force-recreate -d
     ```
2. Check health
  For the CI/CD and webhook :
    ```bash
      tail -f local_api.log
      ```
    
  For the server back and front :
  ```
      docker logs fastapi_backend
      docker logs vite_frontend
  ```
    
    

Before making any modifications, ensure you review the Dockerfiles in both the server and client, as well as the Docker Compose file and the Nginx folder. Always test using npm run build and npm run dev before pushing your changes to prevent breaking the CI/CD pipeline—it's essential for maintaining good practices.

Enjoy ;)
