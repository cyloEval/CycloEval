import React, { useState } from 'react';
import FileInput from './FileInput';
import UploadButton from './UploadButton';
import ActionButtons from './ActionButtons';
import { api, sendSensorDataToApi, SensorData } from '../../lib/api';
import Loader from './Loader';

type FileUploadMenuProps = {
  onCancel: () => void;
  onContinue: () => void;
};

const FileUploadMenu: React.FC<FileUploadMenuProps> = ({
  onCancel,
  onContinue,
}) => {
  const [fileName, setFileName] = useState<string>(
    'Choisissez un fichier json',
  );
  const [rawData, setRawData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // Ajoutez cet état

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type !== 'application/json') {
      alert('Le fichier doit être de type JSON.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const json = JSON.parse(content);
        setRawData(JSON.stringify(json));
      }
    };

    if (file) {
      setFileName(file.name);
      reader.readAsText(file);
    }
  };

  const handleFileUpload = async () => {
    setLoading(true);
    if (rawData) {
      const data: SensorData = { raw_json: rawData, filename: fileName };
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${api}/importSensorData`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            alert(`Fichier ${fileName} uploader avec succès`);
          } else {
            alert('Failed to upload file');
          }
          setLoading(false);
          setRawData(null);
          setFileName('Choisissez un fichier json');
          setProgress(0);
        };
        xhr.onerror = () => {
          alert('Failed to upload file');
          setLoading(false);
        };
        xhr.send(JSON.stringify(data));
      } catch (error) {
        alert('Failed to upload file');
        console.error(error);
        setLoading(false);
      }
    } else {
      alert('Aucun fichier à télécharger');
      setLoading(false);
    }
  };

  return (
    <div className="fixed left-1/2 top-1/2 z-50 h-[200px] w-[1000px] max-w-[80%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white bg-opacity-85 p-5 text-center shadow-lg">
      {loading ? (
        <div className="flex justify-center">
          <Loader />
          <div className="mt-2 text-center">{`Progression: ${progress.toFixed(2)}%`}</div>
        </div>
      ) : (
        <div className="mb-5 flex justify-center gap-5">
          <FileInput fileName={fileName} onFileChange={handleFileChange} />
          <UploadButton onFileUpload={handleFileUpload} />
        </div>
      )}
      <ActionButtons onCancel={onCancel} onContinue={onContinue} />
    </div>
  );
};

export default FileUploadMenu;
