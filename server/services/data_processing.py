import numpy as np
from scipy.spatial.transform import Rotation
from geopy.distance import geodesic
from server.schemas import ShockData, get_sensor_data, SensorData

def process_sensor_data(sensorData: SensorData) -> list[dict]:
    orientations = [orientation.model_dump() for orientation in sensorData.orientations if orientation.time]
    locations = [location.model_dump() for location in sensorData.locations if location.time]
    accelerometers = [accelerometer.model_dump() for accelerometer in sensorData.accelerometers if accelerometer.time]

    field_to_drop = ['sensor', 'bearing' ,'seconds_elapsed', 'bearingAccuracy', 'speedAccuracy', 'verticalAccuracy', 'horizontalAccuracy', 'roll', 'pitch', 'yaw']
    field_to_float = ['altitude', 'longitude', 'latitude', 'speed', 'z', 'y', 'x', 'qz', 'qy', 'qx', 'qw']

    def clean_data(data):
        data['time'] = int(data['time'])
        for field in field_to_drop:
            if field in data:
                del data[field]
        for field in field_to_float:
            if field in data:
                data[field] = float(data[field])
        return data

    orientations = [clean_data(orientation) for orientation in orientations]
    locations = [clean_data(location) for location in locations]
    accelerometers = [clean_data(accelerometer) for accelerometer in accelerometers]

    merged_data = []
    for location in locations:
        time = location['time']
        accelerometer = min(accelerometers, key=lambda x: abs(x['time'] - time))
        orientation = min(orientations, key=lambda x: abs(x['time'] - time))
        merged_data.append({**location, **accelerometer, **orientation})

    print(merged_data)
    return merged_data

def quaternion_to_rotation_matrix(qw, qx, qy, qz):
    return Rotation.from_quat([qx, qy, qz, qw])

def rotate_acceleration(accel_x, accel_y, accel_z, rotation: Rotation) -> np.ndarray:
    accel_local = np.array([accel_x, accel_y, accel_z])
    accel_global = rotation.apply(accel_local)
    return accel_global

def filter_shocks(shocks: list[ShockData]) -> list[ShockData]:
    filtered_shocks = []
    for shock in shocks:
        lat, lon = shock.latitude, shock.longitude
        too_close = False
        for i, filtered_shock in enumerate(filtered_shocks):
            lat2, lon2 = filtered_shock.latitude, filtered_shock.longitude
            if geodesic((lat, lon), (lat2, lon2)).meters < 1:
                too_close = True
                if shock.zAccel > filtered_shock.zAccel:
                    filtered_shocks[i] = shock
                break
        if not too_close:
            filtered_shocks.append(shock)
    return filtered_shocks

def detect_shocks(merged_data: list[dict], shock_threshold: float = 3.0) -> list[ShockData]:
    shocks = []
    for row in merged_data:
        accel_z = row['z']
        qw, qx, qy, qz = row['qw'], row['qx'], row['qy'], row['qz']

        rotation = quaternion_to_rotation_matrix(qw, qx, qy, qz)
        global_z_accel = rotate_acceleration(0, 0, accel_z, rotation)[2]

        if abs(global_z_accel) > shock_threshold and row['speed'] > 5:
            shocks.append(ShockData(
                time=row['time'],
                zAccel=global_z_accel,
                latitude=row['latitude'],
                longitude=row['longitude'],
                altitude=row['altitude']
            ))

    return filter_shocks(shocks)

def extract_shocks_sensor_data(sensor_json: list[dict]) -> list[ShockData]:
    sensor_data = get_sensor_data(sensor_json)
    merged_data = process_sensor_data(sensor_data)
    return detect_shocks(merged_data)
