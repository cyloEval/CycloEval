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

export const sendSensorDataToApi = async (data: SensorData) => {
  const response = await fetch(`${api}/importSensorData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw_json: data.raw_json, filename: data.filename }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }
  return response.json();
};
