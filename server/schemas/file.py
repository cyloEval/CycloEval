from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

class FileCreate(BaseModel):
    filename: str
    user_id: int
    content: str

class FileResponse(BaseModel):
    id: int
    filename: str
    user_id: int
    upload_time: datetime
    content: str

    model_config = ConfigDict(from_attributes=True)

class FileResponseShort(BaseModel):
    id: int
    filename: str
    user_id: int

    model_config = ConfigDict(from_attributes=True)
