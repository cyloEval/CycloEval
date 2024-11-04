from pydantic import BaseModel, ConfigDict

class RouteCreate(BaseModel):
    name: str
    userId: int
    coordinatesIds: list[int]

class RouteResponse(BaseModel):
    id: int
    name: str
    userId: int
    coordinatesIds: list[int]
    model_config = ConfigDict(from_attributes=True)

