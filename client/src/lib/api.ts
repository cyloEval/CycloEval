
export const api = "http://127.0.0.1:8000";

const sendSensorDataToApi = async (data: string) => {
  const response = await fetch(`${api}/importSensorData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
}

export default sendSensorDataToApi;
