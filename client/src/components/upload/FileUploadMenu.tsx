import React, { useState } from 'react';
import FileInput from './FileInput';
import UploadButton from './UploadButton';
import ActionButtons from './ActionButtons';
import Loader from './Loader';
import { api } from '../../lib/api';

type FileUploadMenuProps = {
  onCancel: () => void;
  onContinue: () => void;
  onUploadSuccess: () => void; // New prop
};

const FileUploadMenu: React.FC<FileUploadMenuProps> = ({
  onCancel,
  onContinue,
  onUploadSuccess, // New prop
}) => {
  const [fileName, setFileName] = useState<string>(
    'Choisissez un fichier JSON',
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      setError('Aucun fichier sélectionné.');
      return;
    }

    if (selectedFile.type !== 'application/json') {
      setError('Le fichier doit être de type JSON.');
      return;
    }

    setFileName(selectedFile.name);
    setFile(selectedFile);
    setError(null); // Clear previous errors
  };

  const uploadFileInChunks = async (file: File) => {
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      const start = chunkNumber * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunk_number', chunkNumber.toString());
      formData.append('total_chunks', totalChunks.toString());
      formData.append('filename', file.name);

      try {
        const response = await fetch(`${api}/upload-chunk/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.statusText}`);
        }

        setProgress(((chunkNumber + 1) / totalChunks) * 100);
      } catch (error) {
        setError(`Échec du téléchargement : ${error}`);
        console.error(error);
        return false;
      }
    }

    return true;
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Aucun fichier à télécharger.');
      return;
    }

    setLoading(true);
    const success = await uploadFileInChunks(file);
    setLoading(false);

    if (success) {
      alert(`Fichier ${fileName} uploadé avec succès.`);
      setFile(null);
      setFileName('Choisissez un fichier JSON');
      setProgress(0);
      onUploadSuccess(); // Notify parent component
    }
  };

  return (
    <div className="fixed left-1/2 top-1/2 z-50 h-auto w-[600px] max-w-[80%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white bg-opacity-85 p-5 text-center shadow-lg">
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader progress={progress} />
          <p className="mt-4 text-gray-600">
            Téléchargement en cours... {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-5 flex flex-col items-center gap-4">
            <FileInput fileName={fileName} onFileChange={handleFileChange} />
            {error && <p className="text-red-500">{error}</p>}
            <UploadButton onFileUpload={handleFileUpload} />
          </div>
          <ActionButtons onCancel={onCancel} onContinue={onContinue} />
        </div>
      )}
    </div>
  );
};

export default FileUploadMenu;
