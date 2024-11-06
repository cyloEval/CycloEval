import { useState } from "react";
import FileInput from "./FileInput";
import UploadButton from "./UploadButton";
import ActionButtons from "./ActionButtons";
import sendSensorDataToApi, { SensorData, Token } from "../../lib/api";

type FileUploadProps = {
  onCancel: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onCancel }) => {
  const [fileName, setFileName] = useState<string>(
    "Choisissez un fichier json"
  );
  const [rawData, setRawData] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // check if file is json
    if (file?.type !== "application/json") {
      alert("Le fichier doit être de type JSON.");
      return;
    }

    // extract json
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setRawData(content);
      }
    };

    if (file) {
      setFileName(file.name);
      reader.readAsText(file);
    }
  };

  // send to api on upload
  const handleFileUpload = () => {
    if (rawData) {
      const data: SensorData = { raw_json: rawData, filename: fileName };
      try {
        const res = sendSensorDataToApi(data);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Veuillez choisir un fichier.");
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80%] w-[1000px] h-[200px] p-5 bg-white bg-opacity-85 rounded-lg shadow-lg text-center z-50">
      <div className="flex justify-center gap-5 mb-5">
        <FileInput fileName={fileName} onFileChange={handleFileChange} />
        <UploadButton onFileUpload={handleFileUpload} />
      </div>
      <ActionButtons onCancel={onCancel} />
    </div>
  );
};

export default FileUpload;
