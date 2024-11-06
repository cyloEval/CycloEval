
export const api = "http://127.0.0.1:8000";

type token = string;
const sendSensorDataToApi = async (data: string, token:token) => {
  const response = await fetch(`${api}/importSensorData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
}

export default sendSensorDataToApi;
