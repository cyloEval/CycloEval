from datetime import datetime
from server.models import GPSPointCreate, Location

class GPSPointProcessor:
    def __init__(self, times: list[str], z_global: list[float], locations: list[Location]):
        self.times = times
        self.z_global = z_global
        self.locations = locations

        # Convert location times to datetime objects
        for location in self.locations:
            location.time = datetime.fromtimestamp(int(location.time) / 1e9)

    # Associate GPS points with global z acceleration data
    def associate(self) -> list[GPSPointCreate]:
        if len(self.locations) == 0:
            return []
        gps_points = []
        old_time = self.locations[0].time if len(self.locations) > 0 else None
        for i in range(1, len(self.locations)):
            # Find max acceleration in time range
            time = self.locations[i].time
            max_accel = self.__find_max_acceleration_within_time_range(old_time, time)
            old_time = time

            # Create GPS point
            gps_point = GPSPointCreate(
                latitude=self.locations[i].latitude,
                longitude=self.locations[i].longitude,
                altitude=self.locations[i].altitude,
                horizontalAccuracy=self.locations[i].horizontalAccuracy,
                verticalAccuracy=self.locations[i].verticalAccuracy,
                speedAccuracy=self.locations[i].speedAccuracy,
                zAccel=max_accel,
                timestamp=self.locations[i].time
            )
            gps_points.append(gps_point)

        return gps_points

    def __find_max_acceleration_within_time_range(self, start_time: datetime, end_time: datetime) -> float:
        max_acceleration = 0.0
        for i in range(len(self.times)):
            time = datetime.fromtimestamp(int(self.times[i])/1e9)
            if start_time <= time <= end_time:
                if self.z_global[i] > max_acceleration:
                    max_acceleration = self.z_global[i]
        return max_acceleration