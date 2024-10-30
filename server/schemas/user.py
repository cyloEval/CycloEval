from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class UserResponse(BaseModel):
    userId: int
    email: str
    name: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)

class UserSignIn(BaseModel):
    email: str
    password: str

class TokenData(BaseModel):
    email: str
