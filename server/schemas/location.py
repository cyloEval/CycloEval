from pydantic import BaseModel

class LocationCreate(BaseModel):
    routeId: int
    coordinateId: int
