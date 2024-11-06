import pytest
from server.crud.coordinate import get_coordinate, create_coordinate, get_nearby_coordinate
from server.schemas import CoordinateCreate

def test_create_coordinate(db):
    coord_create = CoordinateCreate(latitude=48.8566, longitude=2.3522, altitude=35.0)
    coord_response = create_coordinate(db, coord_create)
    assert coord_response.id is not None
    assert coord_response.latitude == 48.8566

def test_get_coordinate(db):
    coord_response = get_coordinate(db, coordinate_id=1)
    assert coord_response is not None
    assert coord_response.latitude == 48.8566

def test_get_nearby_coordinate(db):
    coord_response = get_nearby_coordinate(db, latitude=48.8566, longitude=2.3522)
    assert coord_response is not None
    assert coord_response.latitude == 48.8566
