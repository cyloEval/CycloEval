from fastapi import FastAPI, Request, HTTPException, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from server.api.routes import router as api_router
from server.core.database import engine, Base
import logging
import hmac
import hashlib
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Retrieve environment variables
GITHUB_SECRET = os.getenv("GITHUB_SECRET").encode()
LOCAL_API_URL = os.getenv("LOCAL_API_URL")
UPLOAD_API_URL = os.getenv("UPLOAD_API_URL")
DATABASE_PATH = os.getenv("DATABASE_PATH")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cycloeval.datakelabsone.cloud", "http://127.0.0.1:5173", "*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/webhook/push")
async def handle_push(
    request: Request,
    background_tasks: BackgroundTasks,
    x_hub_signature_256: str = Header(None),
    x_github_event: str = Header(None),
):
    """
    Handle GitHub push events to trigger a deployment.
    """
    try:
        body = await request.body()

        # Validate the signature
        if x_hub_signature_256 is None:
            logger.error("Missing signature header")
            raise HTTPException(status_code=403, detail="Signature missing")

        expected_signature = "sha256=" + hmac.new(GITHUB_SECRET, body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected_signature, x_hub_signature_256):
            logger.error("Invalid signature")
            raise HTTPException(status_code=403, detail="Invalid signature")

        if x_github_event != "push":
            logger.warning(f"Unhandled GitHub event: {x_github_event}")
            return {"message": f"Unhandled event: {x_github_event}"}

        payload = await request.json()
        logger.info(f"Received push event: {payload}")

        background_tasks.add_task(trigger_deployment)
        return {"message": "Push event received. Deployment triggered in the background."}

    except Exception as e:
        logger.exception(f"Error handling push event: {e}")
        raise HTTPException(status_code=500, detail="Push event handling error")


@app.post("/webhook/db")
async def send_database(background_tasks: BackgroundTasks):
    """
    Send the database to the local API.
    """
    try:
        if not os.path.exists(DATABASE_PATH):
            logger.error("Database file not found")
            raise HTTPException(status_code=404, detail="Database not found")

        background_tasks.add_task(upload_database)
        return {"message": "Database upload initiated in the background."}

    except Exception as e:
        logger.exception(f"Error initiating database upload: {e}")
        raise HTTPException(status_code=500, detail="Database upload initiation error")


async def trigger_deployment():
    """
    Trigger deployment via the local API.
    """
    try:
        response = requests.post(LOCAL_API_URL)
        response.raise_for_status()
        logger.info("Deployment triggered successfully")
    except requests.RequestException as e:
        logger.error(f"Failed to trigger deployment: {e}")


async def upload_database():
    """
    Upload the database to the local API.
    """
    try:
        with open(DATABASE_PATH, "rb") as db_file:
            files = {"file": db_file}
            response = requests.post(UPLOAD_API_URL, files=files)
            response.raise_for_status()
            logger.info("Database uploaded successfully")
    except requests.RequestException as e:
        logger.error(f"Failed to upload database: {e}")


app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

