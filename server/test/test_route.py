import pytest
from server.crud import create_route, get_route, create_coordinate, create_user, get_routes_by_user
from server.schemas import RouteCreate, CoordinateCreate, UserCreate, RouteResponse, RouteResponseWithCoordinates

def test_create_route(db):
    db_coord = create_coordinate(db, CoordinateCreate(latitude=48.8566, longitude=2.3522, altitude=35.0))


    route_create = RouteCreate(user_id=1, coordinate_ids=[db_coord.id])
    route_response = create_route(db, route_create)
    assert route_response.id is not None
    assert route_response.user_id == 1
    assert route_response.coordinate_ids == [db_coord.id]

def test_get_route(db):
    route_response = get_route(db, route_id=1)
    assert route_response is not None
    assert route_response.user_id == 1
    assert route_response.coordinate_ids == [1]



def test_get_routes_by_user(db):

    # Create a user
    user = create_user(db, UserCreate(email="test@testEmail.com", password="testPassword"))

    # Create a route
    coords = [
        create_coordinate(db, CoordinateCreate(latitude=48.8566, longitude=2.3522, altitude=35.0)),
        create_coordinate(db, CoordinateCreate(latitude=49.8566, longitude=3.3522, altitude=36.0)),
    ]
    route = create_route(db, RouteCreate(user_id=user.id, coordinate_ids=[coord.id for coord in coords]))

    # Get the routes
    routes:RouteResponseWithCoordinates = get_routes_by_user(db, user.id)

    assert len(routes) == 1
    assert routes[0].id == route.id
    assert routes[0].user_id == user.id
    assert routes[0].latitude == [coord.latitude for coord in coords]
    assert routes[0].longitude == [coord.longitude for coord in coords]
    assert routes[0].altitude == [coord.altitude for coord in coords]
