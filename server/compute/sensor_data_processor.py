import numpy as np
from scipy.spatial.transform import Rotation
from server.models import SensorData, Accelerometer, Orientation, Metadata, Location
import logging

logger = logging.getLogger(__name__)

class SensorDataProcessor:

    # process global z acceleration
    @staticmethod
    def process_Z_global_acceleration(acceleration_data:list[Accelerometer], orientation_data:list[Orientation]) -> tuple[list[str], list[float]]:
        merged_data = SensorDataProcessor.__join_acceleration_orientation_on_time(acceleration_data, orientation_data)
        global_acceleration = SensorDataProcessor.__compute_global_acceleration(merged_data)
        times = [row['time'] for row in global_acceleration]
        global_z_accels = [row['global_z_accel'] for row in global_acceleration]
        return times, global_z_accels

    @staticmethod
    def import_sensor_data(json_data: list[dict]) -> SensorData:
        try:
            if json_data[0].get("sensor") == "Metadata":
                metadata = Metadata(**json_data[0])
            else:
                metadata = None
            locations = []
            accelerometers = []
            orientations = []

            for data in json_data:
                sensor_type = data.get("sensor")
                if sensor_type == "Location":
                    locations.append(Location(**data))
                elif sensor_type == "Accelerometer":
                    accelerometers.append(Accelerometer(**data))
                elif sensor_type == "Orientation":
                    orientations.append(Orientation(**data))
        except Exception as e:
            print(e)
            return SensorData(
                metadata=None,
                locations=None,
                accelerometers=None,
                orientations=None
                )

        return SensorData(
            metadata=metadata,
            locations=locations,
            accelerometers=accelerometers,
            orientations=orientations
        )

    @staticmethod
    def __quaternion_to_rotation_matrix(qw, qx, qy, qz):
        return Rotation.from_quat([qx, qy, qz, qw])

    @staticmethod
    def __rotate_acceleration(accel_x, accel_y, accel_z, rotation: Rotation) -> np.ndarray:
        accel_local = np.array([float(accel_x), float(accel_y), float(accel_z)])
        return rotation.apply(accel_local)

    @staticmethod
    def __join_acceleration_orientation_on_time(accel_data: list[Accelerometer], orientation_data: list[Orientation]) -> list[dict]:
        merged_data = []
        size = len(accel_data)
        for i, accel_row in enumerate(accel_data):
        # show progress every 10% of the way
            if i % (size // 10) == 0:
                logger.info(f"{i} of {size} rows processed")
            accel_time = accel_row.time
            orientation_row = orientation_data[i]
            if orientation_row.time == accel_time:
                merged_data.append({**accel_row.__dict__ , **orientation_row.__dict__})
        return merged_data

    @staticmethod
    def __compute_global_acceleration(merged_data: list[dict]) -> list[dict]:
        global_acceleration = []
        for row in merged_data:
            qw, qx, qy, qz = row.get('qw', 1.0), row.get('qx', 0.0), row.get('qy', 0.0), row.get('qz', 0.0)
            rotation = SensorDataProcessor.__quaternion_to_rotation_matrix(qw, qx, qy, qz)
            global_acceleration.append({
                'time': row['time'],
                'global_z_accel': SensorDataProcessor.__rotate_acceleration(0, 0, float(row['z']), rotation)[2]
            })
        return global_acceleration