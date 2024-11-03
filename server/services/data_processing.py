from typing import List, Optional
from pydantic import BaseModel
import numpy as np
from scipy.spatial.transform import Rotation as R
import pandas as pd
from geopy.distance import geodesic
from server.schemas.sensor_data import SensorData
import datetime

class ShockData(BaseModel):
    time: datetime
    zAccel: float
    latitude: float
    longitude: float
    altitude: float

def parse_json_data(data: List[dict]) -> pd.DataFrame:
    df = pd.DataFrame(data)
    return df

def process_sensor_data(df: pd.DataFrame) -> pd.DataFrame:
    accel_df = df[['time', 'z']].dropna(subset=['z']).astype({'time': 'float64', 'z': 'float64'})
    orient_df = df[['time', 'qx', 'qy', 'qz', 'qw']].dropna(subset=['qw']).astype({'time': 'float64', 'qx': 'float64', 'qy': 'float64', 'qz': 'float64', 'qw': 'float64'})
    location_df = df[['time', 'latitude', 'longitude', 'altitude', 'speed']].dropna(subset=['latitude']).astype({'time': 'float64', 'latitude': 'float64', 'longitude': 'float64', 'altitude': 'float64', 'speed': 'float64'})

    merged_df = pd.merge_asof(accel_df.sort_values('time'), orient_df.sort_values('time'), on='time', direction='nearest')
    merged_df = pd.merge_asof(merged_df.sort_values('time'), location_df.sort_values('time'), on='time', direction='nearest')

    return merged_df

def quaternion_to_rotation_matrix(qw, qx, qy, qz):
    return R.from_quat([qx, qy, qz, qw])

def rotate_acceleration(accel_x, accel_y, accel_z, rotation):
    accel_local = np.array([accel_x, accel_y, accel_z])
    accel_global = rotation.apply(accel_local)
    return accel_global

def detect_shocks(merged_df: pd.DataFrame, shock_threshold: float = 3.0) -> List[ShockData]:
    shocks = []
    for _, row in merged_df.iterrows():
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

    # Filter shocks to avoid overlapping data points
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
