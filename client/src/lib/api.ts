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

export type FileResponseShort = {
  id: number;
  filename: string;
  upload_time: string;
};

export type apiRoute = 'GPSPoints' | 'file';

export const api = import.meta.env.VITE_API_URL ?? '/api';

export const getDataFromApi = async (route: apiRoute) => {
  const response = await fetch(`${api}/${route}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};

export const deleteFile = async (fileId: number) => {
  const response = await fetch(`${api}/delete-file/${fileId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete file');
  }

  return response.json();
};

export const getFiles = async (): Promise<FileResponseShort[]> => {
  const response = await fetch(`${api}/file`);

  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }

  return response.json();
};

export const resetDatabase = async () => {
  const response = await fetch(`${api}/reset-database`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to reset database');
  }

  return response.json();
};
