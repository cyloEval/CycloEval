from typing import List, Optional
from pydantic import BaseModel
import numpy as np
from scipy.spatial.transform import Rotation as R

class ShockData(BaseModel):
    time: float
    zAccel: float
    latitude: float
    longitude: float
    altitude: float


class SensorData(BaseModel):
    time: float
    x: Optional[float]
    y: Optional[float]
    z: Optional[float]
    qx: Optional[float]
    qy: Optional[float]
    qz: Optional[float]
    qw: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    altitude: Optional[float]
    speed: Optional[float]


def parse_json_data(data: List[dict]) -> List[SensorData]:
    return [SensorData(**entry) for entry in data]


def process_sensor_data(data: List[SensorData]):
    accel_data = [{"time": d.time, "z": d.z} for d in data if d.z is not None]
    orient_data = [{"time": d.time, "qx": d.qx, "qy": d.qy, "qz": d.qz, "qw": d.qw} for d in data if d.qw is not None]
    location_data = [{"time": d.time, "latitude": d.latitude, "longitude": d.longitude, "altitude": d.altitude} for d in data if d.latitude is not None]

    accel_df = {entry["time"]: entry for entry in accel_data}
    orient_df = {entry["time"]: entry for entry in orient_data}
    location_df = {entry["time"]: entry for entry in location_data}

    merged_data = []
    for time in accel_df.keys():
        merged_entry = {**accel_df.get(time, {}), **orient_df.get(time, {}), **location_df.get(time, {})}
        merged_data.append(merged_entry)
    return merged_data


def detect_shocks(merged_data: List[dict], shock_threshold: float = 3.0) -> List[ShockData]:
    shocks = []
    for row in merged_data:
        accel_z = row.get("z", 0)
        qw, qx, qy, qz = row.get("qw", 1), row.get("qx", 0), row.get("qy", 0), row.get("qz", 0)

        rotation = R.from_quat([qx, qy, qz, qw])
        global_z_accel = rotation.apply([0, 0, accel_z])[2]

        if abs(global_z_accel) > shock_threshold:
            shocks.append(ShockData(
                time=row["time"],
                zAccel=global_z_accel,
                latitude=row.get("latitude", 0),
                longitude=row.get("longitude", 0),
                altitude=row.get("altitude", 0)
            ))
    return shocks
