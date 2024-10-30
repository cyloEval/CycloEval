import unittest
import json
import pandas as pd
from server.services.data_processing import parse_json_data, process_sensor_data, detect_shocks, ShockData

class TestDataProcessing(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('server/test/test_data.json') as file:
            cls.data = json.load(file)

    def test_parse_json_data(self):
        sensor_data_df = parse_json_data(self.data)
        self.assertIsInstance(sensor_data_df, pd.DataFrame)
        self.assertFalse(sensor_data_df.empty)

    def test_process_sensor_data(self):
        sensor_data_df = parse_json_data(self.data)
        merged_df = process_sensor_data(sensor_data_df)
        self.assertIsNotNone(merged_df)
        self.assertIsInstance(merged_df, pd.DataFrame)
        self.assertFalse(merged_df.empty)
        self.assertIn('z', merged_df.columns)
        self.assertIn('qw', merged_df.columns)
        self.assertIn('latitude', merged_df.columns)

    def test_detect_shocks(self):
        sensor_data_df = parse_json_data(self.data)
        merged_df = process_sensor_data(sensor_data_df)
        shocks = detect_shocks(merged_df)
        self.assertIsInstance(shocks, list)
        if shocks:
            self.assertIsInstance(shocks[0], ShockData)
            self.assertGreater(shocks[0].zAccel, 3.0)

if __name__ == '__main__':
    unittest.main()
