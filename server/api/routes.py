import logging
from fastapi import APIRouter, Depends, Request,  HTTPException
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
from typing import List
from datetime import timedelta, datetime
from jose import JWTError, jwt
import json
from pydantic import BaseModel

from server.schemas import *
from server.core.database import get_db
from server.crud import (
    create_coordinate, get_nearby_coordinate,
    create_user, authenticate_user, get_user_by_email, get_user,
    create_detected_shock, get_shocks_by_user_with_coord, shockData_to_DetectedShockCreate, get_all_shocks,
    create_file, create_route, get_routes_by_user
)
from server.core.security import verify_password, create_access_token, oauth2_scheme
from server.core.config import settings
from server.services import get_sensor_data, extract_shocks_sensor_data


# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    logger.info("Received registration request for email: %s", user.email)
    try:
        db_user = get_user_by_email(db, user.email)
        if db_user:
            logger.warning("Email already registered: %s", user.email)
            raise HTTPException(status_code=400, detail="Email already registered")
        new_user: UserResponse = create_user(db, user)
        logger.info("User created successfully: %s", new_user.email)
        return new_user
    except Exception as e:
        logger.error("Error during registration: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")




@router.post("/auth/google-auth")
async def google_auth(request: Request, db: Session = Depends(get_db)):
    try:
        # Récupérer le contenu JSON envoyé par le frontend
        data = await request.json()
        logger.info("Données reçues : %s", data)
        
        id_token_google = data.get("id_token")
        if not id_token_google:
            logger.error("Token Google manquant")
            raise HTTPException(status_code=400, detail="Missing id_token")

        # Vérifier le token Google
        try:
            id_info = id_token.verify_oauth2_token(
                id_token_google,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
            logger.info("Informations de l'utilisateur Google : %s", id_info)
        except ValueError as e:
            logger.error("Échec de la vérification du token : %s", str(e))
            raise HTTPException(status_code=400, detail="Invalid token")

        # Extraire l'email depuis le token
        email = id_info.get("email")
        
        if not email:
            logger.error("Email non trouvé dans le token")
            raise HTTPException(status_code=400, detail="Email not found in token")

        # Vérifier si l'utilisateur existe déjà
        user = get_user_by_email(db, email)
        if not user:
            logger.info("Utilisateur non trouvé, création d'un nouveau compte")
            # Créer un nouvel utilisateur sans mot de passe
            user_create = UserCreate(email=email, password="")
            user = create_user(db, user_create)
        else:
            logger.info("Utilisateur existant trouvé : %s", user.email)

        # Générer un token JWT pour l'utilisateur
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        logger.info("Authentification réussie pour : %s", user.email)
        return {"access_token": access_token, "token_type": "bearer", "email": user.email}

    except Exception as e:
        logger.error("Erreur interne du serveur : %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")






@router.post("/auth/login", response_model=Token)
def login(user: UserSignIn, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for email: {user.email}")
    authenticated_user = authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        logger.warning(f"Failed login attempt for email: {user.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": authenticated_user.email}, expires_delta=access_token_expires
    )
    logger.info(f"User logged in successfully: {user.email}")
    return Token(access_token=access_token, token_type="bearer", email=authenticated_user.email, user_id=authenticated_user.id)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return UserResponse(id=user.id, email=user.email)

class SendedData(BaseModel):
    filename: str
    raw_json: str

@router.post("/importSensorData", response_model=List[DetectedShockResponse])
async def import_sensor_data(data:SendedData , db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    filename, raw_json = data.filename, data.raw_json
    json_data = json.loads(raw_json)
    try:
        # Extract the sensor data from the raw json and calculate the detected shocks
        data:SensorData = get_sensor_data(json_data)
        detecteds_shocks:ShockData = extract_shocks_sensor_data(json_data)

        # Store the raw data in the File table
        created_file: FileResponseShort = create_file(db, FileCreate(filename=filename, user_id=current_user.id))

        coordinates = data.locations
        coordinate_ids = []
        # Store the Coordinate
        for coord in coordinates:
            created_coord = create_coordinate(db, CoordinateCreate(latitude=coord.latitude, longitude=coord.longitude, altitude=coord.altitude))
            coordinate_ids.append(created_coord.id)

        # Store the Route

        created_route:RouteResponse = create_route(db, RouteCreate(user_id=current_user.id, coordinate_ids=coordinate_ids))

        # Store the DetectedShock
        detecteds_shocks_response = []
        for shock in detecteds_shocks:
            detected_shock_create = shockData_to_DetectedShockCreate(shock, current_user.id)
            db_shock:DetectedShockResponse = create_detected_shock(db, detected_shock_create)
            detecteds_shocks_response.append(db_shock)
        return detecteds_shocks_response

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal Server Error: {str(e)}')

# type filterType = 'allShocks' | 'userShocks' | 'userRoutes'



@router.get("/userShocks", response_model=List[DetectedShockResponse])
def get_shocks(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return get_shocks_by_user_with_coord(db, current_user.id)

@router.get("/allShocks", response_model=List[DetectedShockResponse])
def get_all_shocks_route(db: Session = Depends(get_db)):
    return get_all_shocks(db)

@router.get("/userRoutes", response_model=List[RouteResponseWithCoordinates])
def get_routes(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return get_routes_by_user(db, current_user.id)
