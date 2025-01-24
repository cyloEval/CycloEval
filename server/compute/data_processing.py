from sqlalchemy.orm import Session
from server.models import GPSPointCreate,  SensorData, GPSPointResponse
from server.crud import create_gps_point
from .sensor_data_processor import SensorDataProcessor
from .high_pass_filter import HighPassFilter
from .gps_point_processor import GPSPointProcessor

def process_gps_points(sensor_json: list[dict]) -> list[GPSPointResponse]:

    # Extract sensor data from JSON
    sensor_data: SensorData = SensorDataProcessor.import_sensor_data(sensor_json)

    # Process sensor data to compute global z acceleration signal
    times, Z_acceleration = SensorDataProcessor.process_Z_global_acceleration(sensor_data)

    # Apply high-pass filter to Z acceleration signal
    Z_acceleration =  HighPassFilter.apply(Z_acceleration)

    # return gps points with z acceleration associated with each point
    gps_points = GPSPointProcessor(times, Z_acceleration, sensor_data.locations)

    return gps_points