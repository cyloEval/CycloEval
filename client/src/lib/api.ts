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

export type apiRoute = 'importSensorData' | 'user/me' | filterType;

export const api = 'http://127.0.0.1:8000';

// const getTokenFromLocal = () => {
//   const token: Token = {
//     access_token: localStorage.getItem('accessToken') as string,
//     token_type: localStorage.getItem('tokenType') as string,
//     email: localStorage.getItem('userEmail') as string,
//     user_id: localStorage.getItem('userId') as string,
//   };
//   if (!token) {
//     throw new Error('Token not found');
//   }
//   return token;
// };

export const getDataFromApi = async (route: apiRoute) => {
  const response = await fetch(`${api}/${route}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};


// export const sendSensorDataToApi = async (data: SensorData) => {
//   const token = getTokenFromLocal();
//   const response = await fetch(`${api}/importSensorData`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token.access_token}`,
//     },
//     body: JSON.stringify({ raw_json: data.raw_json, filename: data.filename }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to upload file');
//   }
//   return response.json();
// };

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
