import pytest
from server.crud.detected_shock import create_detected_shock, get_all_shocks, get_shocks_by_user_with_coord
from server.schemas import DetectedShockCreate, ShockData
from datetime import datetime

def test_create_detected_shock(db):
    shock_data = ShockData(time=1633036800, zAccel=9.81, latitude=48.8566, longitude=2.3522, altitude=35.0)
    shock_create = DetectedShockCreate(
        timestamp=datetime.fromtimestamp(shock_data.time),
        zAccel=shock_data.zAccel,
        userId=1,
        latitude=shock_data.latitude,
        longitude=shock_data.longitude,
        altitude=shock_data.altitude
    )
    shock_response = create_detected_shock(db, shock_create)
    assert shock_response.id is not None
    assert shock_response.zAccel == 9.81

def test_get_all_shocks(db):
    shocks = get_all_shocks(db)
    assert len(shocks) > 0

def test_get_shocks_by_user_with_coord(db):
    shocks = get_shocks_by_user_with_coord(db, user_id=1)
    assert len(shocks) > 0
