from sqlalchemy.orm import Session
from server.models import Route, Coordinate
from server.schemas import RouteCreate, RouteResponse, RouteResponseWithCoordinates

def create_route(db: Session, route:RouteCreate) -> RouteResponse:
    coordinates = db.query(Coordinate).filter(Coordinate.id.in_(route.coordinate_ids)).all()
    db_route = Route(user_id=route.user_id, coordinates=coordinates)
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return RouteResponse(id=db_route.id, user_id=db_route.user_id, coordinate_ids=[coord.id for coord in db_route.coordinates])

def get_route(db: Session, route_id: int) -> RouteResponse:
    db_route = db.query(Route).filter(Route.id == route_id).first()
    return RouteResponse(id=db_route.id, user_id=db_route.user_id, coordinate_ids=[coord.id for coord in db_route.coordinates]) if db_route else None


def get_routes_by_user(db: Session, user_id: int) -> list[RouteResponseWithCoordinates]:
    db_routes = db.query(Route).filter(Route.user_id == user_id).all()
    return [
        RouteResponseWithCoordinates(
            id=db_route.id,
            user_id=db_route.user_id,
            latitude=[coord.latitude for coord in db_route.coordinates],
            longitude=[coord.longitude for coord in db_route.coordinates],
            altitude=[coord.altitude for coord in db_route.coordinates]
        )
        for db_route in db_routes
    ]

def get_routes_by_user_within_time(db: Session, user_id: int, start_time: int, end_time: int) -> list[RouteResponseWithCoordinates]:
    db_routes = db.query(Route).filter(Route.user_id == user_id).all()
    return [
        RouteResponseWithCoordinates(
            id=db_route.id,
            user_id=db_route.user_id,
            latitude=[coord.latitude for coord in db_route.coordinates],
            longitude=[coord.longitude for coord in db_route.coordinates],
            altitude=[coord.altitude for coord in db_route.coordinates]
        )
        for db_route in db_routes
    ]

