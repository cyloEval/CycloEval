import unittest
import json
from server.services.data_processing import extract_shocks_sensor_data
from server.schemas import ShockData, get_sensor_data, SensorData, Metadata, Location, Accelerometer, Orientation

class TestDataProcessing(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('server/test/test_data.json') as file:
            cls.data = json.load(file)

    def test_parse_json_data(self):
        sensor_data:SensorData = get_sensor_data(self.data)
        self.assertTrue(sensor_data)
        self.assertIsInstance(sensor_data, SensorData)
        self.assertIsInstance(sensor_data.metadata, Metadata)
        self.assertIsInstance(sensor_data.locations, list)
        self.assertIsInstance(sensor_data.locations[0], Location)
        self.assertIsInstance(sensor_data.accelerometers, list)
        self.assertIsInstance(sensor_data.accelerometers[0], Accelerometer)
        self.assertIsInstance(sensor_data.orientations, list)

    def test_extract_shocks_sensor_data(self):
        shocks = extract_shocks_sensor_data(self.data)
        self.assertTrue(shocks)
        self.assertIsInstance(shocks, list)
        self.assertIsInstance(shocks[0], ShockData)


if __name__ == '__main__':
    unittest.main()
