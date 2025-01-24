import numpy as np
from scipy.spatial.transform import Rotation
from server.models import SensorData, Accelerometer, Orientation, Metadata, Location
from pydantic import BaseModel
from datetime import datetime

class SensorDataProcessor:

    # process global z acceleration
    @staticmethod
    def process_Z_global_acceleration(sensor_data: SensorData) -> tuple[str, list[float]]:
        orientation_data = sensor_data.orientations
        acceleration_data = sensor_data.accelerometers
        merged_data = SensorDataProcessor.__join_acceleration_orientation_on_time(acceleration_data, orientation_data)
        global_acceleration = SensorDataProcessor.__compute_global_acceleration(merged_data)
        return global_acceleration['time'], global_acceleration['global_z_accel']

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
            print('end of try')
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

    def __quaternion_to_rotation_matrix(qw, qx, qy, qz):
        return Rotation.from_quat([qx, qy, qz, qw])

    def __rotate_acceleration(accel_x, accel_y, accel_z, rotation: Rotation) -> np.ndarray:
        accel_local = np.array([accel_x, accel_y, accel_z])
        return rotation.apply(accel_local)

    def __join_acceleration_orientation_on_time(accel_data: list[Accelerometer], orientation_data: list[Orientation]) -> list[dict]:
        merged_data = []
        for accel_row in accel_data:
            accel_time = accel_row.time
            orientation_row = next((o for o in orientation_data if o.time == accel_time), None)
            if orientation_row:
                merged_data.append({**accel_row, **orientation_row})
        return merged_data

    def __compute_global_acceleration(merged_data: list[dict]) -> list[dict]:
        global_acceleration = []
        for row in merged_data:
            qw, qx, qy, qz = row.get('qw', 1.0), row.get('qx', 0.0), row.get('qy', 0.0), row.get('qz', 0.0)
            rotation = SensorDataProcessor.__quaternion_to_rotation_matrix(qw, qx, qy, qz)
            global_acceleration.append({
                'time': row['time'],
                'global_z_accel': SensorDataProcessor.__rotate_acceleration(0, 0, row['z'], rotation)[2]
            })
        return global_acceleration
