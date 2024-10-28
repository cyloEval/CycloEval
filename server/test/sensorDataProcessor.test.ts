import { parseJSONData, processSensorData, detectShocks } from '../src/dataProcessing';

// Test data
const mockData = [
  { time: 1, x: "0.5", y: "0.3", z: "9.8", qx: "0.1", qy: "0.2", qz: "0.3", qw: "1.0", latitude: "40.7128", longitude: "-74.0060", altitude: "10" },
  { time: 2, x: "0.6", y: "0.4", z: "20", qx: "0.2", qy: "0.3", qz: "0.4", qw: "0.9", latitude: "40.7129", longitude: "-74.0061", altitude: "12" },
];

// Tests for parseJSONData
describe("parseJSONData", () => {
  it("should correctly parse JSON data into SensorData objects", () => {
    const parsedData = parseJSONData(mockData);
    expect(parsedData.length).toBe(2);
    expect(parsedData[0]).toEqual({
      time: 1,
      x: 0.5,
      y: 0.3,
      z: 9.8,
      qx: 0.1,
      qy: 0.2,
      qz: 0.3,
      qw: 1.0,
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 10,
    });
  });

  it("should handle missing fields in JSON data", () => {
    const incompleteData = [{ time: 1, z: "9.8" }];
    const parsedData = parseJSONData(incompleteData);
    expect(parsedData[0]).toEqual({
      time: 1,
      x: undefined,
      y: undefined,
      z: 9.8,
      qx: undefined,
      qy: undefined,
      qz: undefined,
      qw: undefined,
      latitude: undefined,
      longitude: undefined,
      altitude: undefined,
    });
  });
});

// Tests for processSensorData
describe("processSensorData", () => {
  it("should correctly merge data based on time with nearest values", () => {
    const sensorData = parseJSONData(mockData);
    const mergedData = processSensorData(sensorData);

    expect(mergedData.shape[0]).toBe(2); // Number of rows should match
    expect(mergedData.columns.includes("z")).toBe(true);
    expect(mergedData.columns.includes("qw")).toBe(true);
    expect(mergedData.columns.includes("latitude")).toBe(true);
  });
});

// Tests for detectShocks
describe("detectShocks", () => {
  it("should detect shocks based on the z-acceleration threshold", () => {
    const sensorData = parseJSONData(mockData);
    const mergedData = processSensorData(sensorData);

    const shocks = detectShocks(mergedData, 9.0); // Threshold set below the z value
    expect(shocks.length).toBeGreaterThan(0);
    expect(shocks[0].zAccel).toBeGreaterThan(9.0);
  });

  it("should return an empty array if no shocks are above the threshold", () => {
    const sensorData = parseJSONData(mockData);
    const mergedData = processSensorData(sensorData);

    const shocks = detectShocks(mergedData, 12.0); // Threshold set above the z value
    expect(shocks.length).toBe(1);
  });
});
