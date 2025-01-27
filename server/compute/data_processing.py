from sqlalchemy.orm import Session
from server.models import GPSPointCreate,  SensorData, GPSPointResponse
from server.crud import create_gps_point
from .sensor_data_processor import SensorDataProcessor
from .high_pass_filter import HighPassFilter
from .gps_point_processor import GPSPointProcessor
from logging import getLogger

logger = getLogger(__name__)

def process_gps_points(sensor_json: list[dict]) -> list[GPSPointCreate]:

    # Extract sensor data from JSON
    sensor_data: SensorData = SensorDataProcessor.import_sensor_data(sensor_json)

    accelerometer_data = sensor_data.accelerometers
    orientation_data = sensor_data.orientations
    location_data = sensor_data.locations

    logger.info(f"Process accelerometer data")
    # Process sensor data to compute global z acceleration signal
    times, Z_acceleration = SensorDataProcessor.process_Z_global_acceleration(accelerometer_data, orientation_data)

    logger.info(f"Apply high-pass filter to Z acceleration signal")
    # Apply high-pass filter to Z acceleration signal
    Z_acceleration =  HighPassFilter.apply(Z_acceleration)

    logger.info(f"Associate GPS points with Z acceleration")
    # return gps points with z acceleration associated with each point
    gps_processor = GPSPointProcessor(times, Z_acceleration, location_data)
    gps_points = gps_processor.associate()

    return gps_points