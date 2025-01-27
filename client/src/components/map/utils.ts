export const getColor = (zAccel: number, coef: number): string => {
  const green = Math.max(0, 255 - Math.min(255, zAccel * coef));
  const red = Math.min(255, zAccel * coef);
  return `rgb(${red},${green},0)`;
};

export const getOpacity = (
  horizontalAccuracy: number,
  factor: number,
): number => {
  return Math.min(0.8, (10 / horizontalAccuracy) * factor);
};

const radiusFactor: { [key: number]: number } = {
  10: 3,
  9: 50,
  8: 200,
  7: 500,
  6: 1500,
  5: 30000,
  4: 60000,
  3: 100000,
  2: 200000,
  1: 300000,
  0: 500000,
};

export const getRadius = (
  horizontalAccuracy: number,
  zoomLevel: number,
): number => {
  if (zoomLevel <= 10) return radiusFactor[zoomLevel];
  else return horizontalAccuracy;
};
