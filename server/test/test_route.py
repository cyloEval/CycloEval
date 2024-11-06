import pytest
from server.crud import create_route, get_route, create_coordinate
from server.schemas import RouteCreate, CoordinateCreate

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
