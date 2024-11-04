import { useState } from "react";
import FileInput from "./FileInput";
import UploadButton from "./UploadButton";
import ActionButtons from "./ActionButtons";

type FileUploadProps = {
  onCancel: () => void;
  onFileUpload: (file: File) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onCancel, onFileUpload }) => {
  const [fileName, setFileName] = useState<string>(
    "Choisissez un fichier json"
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80%] w-[1000px] h-[200px] p-5 bg-white bg-opacity-85 rounded-lg shadow-lg text-center z-50">
      <div className="flex justify-center gap-5 mb-5">
        <FileInput fileName={fileName} onFileChange={handleFileChange} />
        <UploadButton />
      </div>
      <ActionButtons onCancel={onCancel} />
    </div>
  );
};

export default FileUpload;
