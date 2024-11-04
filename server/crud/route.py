from sqlalchemy.orm import Session
from server.models import Route
from server.schemas import RouteCreate, RouteResponse

def create_route(db: Session, route:RouteCreate) -> RouteResponse:
    db_route = Route(name=route.name, userId=route.userId, coordinates=route.coordinatesIds)
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return RouteResponse(id=db_route.id, name=db_route.name, userId=db_route.userId, coordinatesIds=db_route.coordinates)

def get_route(db: Session, route_id: int):
    return db.query(Route).filter(Route.id == route_id).first()
