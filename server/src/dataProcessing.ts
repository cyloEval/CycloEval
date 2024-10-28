import { toJSON } from "danfojs-node";
import { DataFrame, merge } from "danfojs-node/dist/danfojs-base";
import Quaternion from 'quaternion';

interface SensorData {
  time: number;
  x?: number;
  y?: number;
  z?: number;
  qx?: number;
  qy?: number;
  qz?: number;
  qw?: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  speed?: number;
}

interface ShockData {
  time: number;
  zAccel: number;
  latitude: number;
  longitude: number;
  altitude: number;
}

// Parse JSON data into an array of SensorData objects
export function parseJSONData(data: any): SensorData[] {
  return data.map((entry: any) => ({
    time: Number(entry.time),
    x: entry.x ? parseFloat(entry.x) : undefined,
    y: entry.y ? parseFloat(entry.y) : undefined,
    z: entry.z ? parseFloat(entry.z) : undefined,
    qx: entry.qx ? parseFloat(entry.qx) : undefined,
    qy: entry.qy ? parseFloat(entry.qy) : undefined,
    qz: entry.qz ? parseFloat(entry.qz) : undefined,
    qw: entry.qw ? parseFloat(entry.qw) : undefined,
    latitude: entry.latitude ? parseFloat(entry.latitude) : undefined,
    longitude: entry.longitude ? parseFloat(entry.longitude) : undefined,
    altitude: entry.altitude ? parseFloat(entry.altitude) : undefined,
    speed: entry.speed ? parseFloat(entry.speed) : undefined,
  }));
}

export function processSensorData(data: SensorData[]): DataFrame {
  const accelData = data
    .filter(d => d.z !== undefined)
    .map(d => ({ time: d.time, z: d.z }));
  const orientData = data
    .filter(d => d.qw !== undefined)
    .map(d => ({ time: d.time, qx: d.qx, qy: d.qy, qz: d.qz, qw: d.qw }));
  const locationData = data
    .filter(d => d.latitude !== undefined)
    .map(d => ({ time: d.time, latitude: d.latitude, longitude: d.longitude, altitude: d.altitude }));

  const accelDf = new DataFrame(accelData);
  const orientDf = new DataFrame(orientData);
  const locationDf = new DataFrame(locationData);

  // Combine DataFrames by 'time' using a left join method
  const mergedData = merge({ left: accelDf, right: orientDf, on: ['time'], how: 'left' });
  const finalMergedData = merge({ left: mergedData, right: locationDf, on: ['time'], how: 'left' });

  return finalMergedData;
}
// Detect shocks in merged data based on the Z acceleration and threshold
export function detectShocks(mergedData: DataFrame, shockThreshold: number = 3): ShockData[] {
  const shocks: ShockData[] = [];

  const jsonData = toJSON(mergedData) as any[];

  jsonData.forEach((row: { [key: string]: any }) => {
    const accelZ = row['z'];
    const qw = row['qw'];
    const qx = row['qx'];
    const qy = row['qy'];
    const qz = row['qz'];

    // Create quaternion and convert to rotation matrix
    const quaternion = new Quaternion(qw, qx, qy, qz);
    const rotationMatrix = quaternion.toMatrix(true) as number[][];

    // Apply rotation to acceleration vector along Z-axis
    const globalZAccel = rotationMatrix[2][0] * 0 + rotationMatrix[2][1] * 0 + rotationMatrix[2][2] * accelZ;

    // Detect shock based on threshold and store shock data
    if (Math.abs(globalZAccel) > shockThreshold) {
      shocks.push({
        time: row['time'],
        zAccel: globalZAccel,
        latitude: row['latitude'],
        longitude: row['longitude'],
        altitude: row['altitude'],
      });
    }
  });

  return shocks;
}
