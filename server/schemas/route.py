from pydantic import BaseModel, ConfigDict
from typing import List

class RouteCreate(BaseModel):
    user_id: int
    coordinate_ids: List[int]

class RouteResponse(BaseModel):
    id: int
    user_id: int
    coordinate_ids: List[int]
    model_config = ConfigDict(from_attributes=True)


