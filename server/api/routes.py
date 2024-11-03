from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.models.models import User
from server.core.database import get_db
from server.schemas.user import UserCreate, UserResponse, UserSignIn, Token, TokenData
from server.schemas.detected_shock import DetectedShockCreate, DetectedShockResponse
from server.crud.user import create_user, get_user
from server.crud.detected_shock import create_detected_shock, get_shocks_by_user
from server.core.security import verify_password, oauth2_scheme
from jose import JWTError, jwt
from datetime import datetime, timedelta
from server.core.config import settings


router = APIRouter()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: UserSignIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
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
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/users/", response_model=UserResponse)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = create_user(db, user)
    return db_user

@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/shocks/", response_model=DetectedShockResponse)
def create_detected_shock_endpoint(shock: DetectedShockCreate, db: Session = Depends(get_db)):
    db_shock = create_detected_shock(db, shock)
    return db_shock

@router.get("/users/{user_id}/shocks/", response_model=List[DetectedShockResponse])
def read_shocks_by_user(user_id: int, db: Session = Depends(get_db)):
    db_shocks = get_shocks_by_user(db, user_id)
    return db_shocks

@router.post("/users/{user_id}/importSensorData", response_model=DetectedShockResponse)
def import_json(user_id: int, db: Session = Depends(get_db)):
    pass

# TODO Add a route to import sensor data

# TODO Add a route to get all detected shocks for a user

# TODO Add a route to get all detected shocks for a user within a certain time range

# TODO Add a route to get all detected shocks for a user within a certain location range

# TODO Add a route to get all shocks within a certain time range
