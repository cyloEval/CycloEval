from pydantic import BaseModel, Field
from typing import List, Optional

class Metadata(BaseModel):
    sensor: str
    version: str
    device_name: str = Field(alias="device name")
    recording_epoch_time: str = Field(alias="recording epoch time")
    recording_time: str = Field(alias="recording time")
    recording_timezone: str = Field(alias="recording timezone")
    platform: str
    appVersion: str
    device_id: str = Field(alias="device id")
    sensors: str
    sampleRateMs: str
    standardisation: str

class Orientation(BaseModel):
    sensor: str
    time: str
    seconds_elapsed: str
    qz: str
    qy: str
    qx: str
    qw: str
    roll: str
    pitch: str
    yaw: str

class Location(BaseModel):
    sensor: str
    time: str
    seconds_elapsed: str
    bearingAccuracy: str
    speedAccuracy: str
    verticalAccuracy: str
    horizontalAccuracy: str
    speed: str
    bearing: str
    altitude: str
    longitude: str
    latitude: str

class Accelerometer(BaseModel):
    sensor: str
    time: str
    seconds_elapsed: str
    z: str
    y: str
    x: str

class SensorData(BaseModel):
    metadata: Optional[Metadata]
    orientations: Optional[List[Orientation]]
    locations: Optional[List[Location]]
    accelerometers: Optional[List[Accelerometer]]

def get_sensor_data(json_data: List[dict]) -> SensorData:
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

# # Example usage
# json_data = [
#     {
#         "sensor": "Metadata",
#         "version": "3",
#         "device name": "SM-G970F",
#         "recording epoch time": "1728905892027",
#         "recording time": "2024-10-14_11-38-12",
#         "recording timezone": "Europe/Paris",
#         "platform": "android",
#         "appVersion": "1.38.0",
#         "device id": "e3f7237f-d95c-4dbc-99da-02c4114d9244",
#         "sensors": "Accelerometer|Orientation|Location|Annotation|TotalAcceleration|AccelerometerUncalibrated",
#         "sampleRateMs": "10|10|0||10|10",
#         "standardisation": "false"
#     },
#     {
#         "sensor": "Location",
#         "time": "1728905892027",
#         "seconds_elapsed": "0.0",
#         "bearingAccuracy": "0.0",
#         "speedAccuracy": "0.0",
#         "verticalAccuracy": "0.0",
#         "horizontalAccuracy": "0.0",
#         "speed": "0.0",
#         "bearing": "0.0",
#         "altitude": "0.0",
#         "longitude": "2.3522224",
#         "latitude": "48.856614"
#     },
#     {
#         "sensor": "Accelerometer",
#         "time": "1728905892027",
#         "seconds_elapsed": "0.0",
#         "z": "9.81",
#         "y": "-0.0",
#         "x": "0.0"
#     },
#     {
#         "sensor": "Orientation",
#         "time": "1728905892151481300",
#         "seconds_elapsed": "0.1244814453125",
#         "qz": "0.40559500455856323",
#         "qy": "0.021518999710679054",
#         "qx": "0.18225200474262238",
#         "qw": "0.8954399824142456",
#         "roll": "-0.11666499823331833",
#         "pitch": "-0.35101112723350525",
#         "yaw": "-0.871329128742218"
#     }
#     # More data...
# ]



# # Afficher les objets SensorData
# print(get_sensor_data(json_data))
