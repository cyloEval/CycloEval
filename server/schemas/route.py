from pydantic import BaseModel

class RouteCreate(BaseModel):
    name: str
    userId: int