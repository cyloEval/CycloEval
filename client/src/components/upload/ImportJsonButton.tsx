import { useState } from 'react';
import { useAuth } from "../auth/AuthContext";

const ImportJsonButton: React.FC = () => {
  const [jsonData, setJsonData] = useState<object | null>(null);
  const requiredFields = ['sensor', 'time'];
  const {isSignedIn} = useAuth();


  const validateJsonStructure = (json: any): boolean => {
    if (!Array.isArray(json)) {
      return false;
    }
    return json.every((item: any) => requiredFields.some(field => field in item));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) {
      alert('Please sign in before uploading a file.');
      return;
    }

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (validateJsonStructure(json)) {
            if (window.confirm('Do you want to upload this file?')) {
              setJsonData(json);
              alert('JSON data loaded successfully');
              sendJsonToApi(json);
            }
          } else {
            alert('Invalid JSON format: Missing required fields');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Error parsing JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const sendJsonToApi = async (json: object) => {
    try {
      const response = await fetch(postJsonDataUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });

      if (response.ok) {
        alert('File uploaded successfully');
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      {isSignedIn ? (
        <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          <input type="file" accept=".json" onChange={handleFileUpload} />
          {jsonData && (
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          )}
        </div>
      ) :
      (
        <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Please sign in to upload a file
        </div>
      )
      }
    </div>
  );
};

export default ImportJsonButton;
