import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta, datetime
from jose import JWTError, jwt
import json

from server.schemas import *
from server.core.database import get_db
from server.crud import (
    create_coordinate, get_nearby_coordinate,
    create_user, authenticate_user, get_user_by_email, get_user,
    create_detected_shock, get_shocks_by_user,
    create_file,
    create_route
)
from server.core.security import verify_password, create_access_token, oauth2_scheme
from server.core.config import settings
from server.services import parse_json_data, process_sensor_data, detect_shocks


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
    return {"access_token": access_token, "token_type": "bearer", "email": authenticated_user.email}

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
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return UserResponse(id=user.id, email=user.email)

@router.post("/importSensorData", response_model=List[DetectedShockResponse])
async def import_sensor_data(filename, raw_json:str , db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    try:

        data:SensorData = get_sensor_data(raw_json)

        # Store the raw data in the File table
        created_file: FileResponseShort = create_file(db, FileCreate(filename=filename, user_id=current_user.id, content=raw_json))

        # Store the Route

        coordinates = data.locations
        coordinatesIds = []
        # Store the Coordinate
        for coord in coordinates:
            created_coord = create_coordinate(db, coord.latitude, coord.longitude, coord.altitude)
            coordinatesIds.append(created_coord.id)

        db_route = create_route(db, current_user.id, filename, coordinatesIds)


        # TODO
    #     # Parse and process the data
    #     df = parse_json_data(data)
    #     merged_df = process_sensor_data(df)

    #     # Detect shocks
    #     shocks = detect_shocks(merged_df)

    #     # Store detected shocks in the DetectedShock table
    #     db_shocks = []
    #     for shock in shocks:
    #         # Create or get the coordinate within 1 meter radius
    #         db_coordinate = get_nearby_coordinate(db, shock.latitude, shock.longitude, shock.altitude)
    #         if not db_coordinate:
    #             db_coordinate = Coordinate(
    #                 latitude=shock.latitude,
    #                 longitude=shock.longitude,
    #                 altitude=shock.altitude
    #             )
    #             db.add(db_coordinate)
    #             db.commit()
    #             db.refresh(db_coordinate)

    #         db_shock = DetectedShockModel(
    #             timestamp=datetime.fromtimestamp(shock.time),
    #             zAccel=shock.zAccel,
    #             userId=current_user.id,
    #             coordinateId=db_coordinate.id
    #         )
    #         db.add(db_shock)
    #         db_shocks.append(db_shock)

    #     db.commit()
    #     return db_shocks
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# TODO Add a route to get all detected shocks for a user

# TODO Add a route to get all detected shocks for a user within a certain time range

# TODO Add a route to get all detected shocks for a user within a certain location range
