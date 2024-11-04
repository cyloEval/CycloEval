from sqlalchemy.orm import Session
from server.models import User
from server.schemas import UserCreate, UserResponse
from server.core.security import get_password_hash, verify_password

def create_user(db: Session, user: UserCreate) -> UserResponse:
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return UserResponse(id=db_user.userId, email=db_user.email)

def get_user(db: Session, user_id: int) -> UserResponse:
    db_user = db.query(User).filter(User.id == user_id).first()
    return UserResponse(email=db_user.email, id=db_user.userId) if db_user else None

def get_user_by_email(db: Session, email: str) -> UserResponse:
    db_user = db.query(User).filter(User.email == email).first()
    return UserResponse(email=db_user.email, id=db_user.userId) if db_user else None

def authenticate_user(db: Session, email: str, password: str) -> UserResponse:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return UserResponse(email=user.email, id=user.userId)
