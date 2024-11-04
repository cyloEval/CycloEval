from sqlalchemy.orm import Session
from server.models.models import Route
from server.schemas.route import RouteCreate

def create_route(db: Session, name: str, user_id: int, coordinates: list[float]):
    db_route = Route(name=name, userId=user_id, coordinates=coordinates)
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

def get_route(db: Session, route_id: int):
    return db.query(Route).filter(Route.id == route_id).first()
