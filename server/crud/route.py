from sqlalchemy.orm import Session
from server.models import Route, Coordinate
from server.schemas import RouteCreate, RouteResponse

def create_route(db: Session, route:RouteCreate) -> RouteResponse:
    coordinates = db.query(Coordinate).filter(Coordinate.id.in_(route.coordinate_ids)).all()
    db_route = Route(user_id=route.user_id, coordinates=coordinates)
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return RouteResponse(id=db_route.id, user_id=db_route.user_id, coordinate_ids= [coord.id for coord in db_route.coordinates])

def get_route(db: Session, route_id: int) -> RouteResponse:
    db_route = db.query(Route).filter(Route.id == route_id).first()
    return RouteResponse(id=db_route.id, user_id=db_route.user_id, coordinate_ids=[coord.id for coord in db_route.coordinates]) if db_route else None
