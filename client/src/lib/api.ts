export type Token = {
  access_token: string;
  token_type: string;
  email: string;
  user_id: string;
};

export type SensorData = {
  raw_json: string;
  filename: string;
};

export type filterType = 'allShocks' | 'userShocks' | 'userRoutes';

export type apiRoute = 'GPSPoints';

export const api = import.meta.env.VITE_API_URL ?? '/api';

export const getDataFromApi = async (route: apiRoute) => {
  const response = await fetch(`${api}/${route}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};

import pako from 'pako';

export const sendSensorDataToApi = async (data: SensorData) => {
  const compressed = pako.gzip(JSON.stringify(data));
  const response = await fetch(`${api}/importSensorData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip',
    },
    body: compressed,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
};