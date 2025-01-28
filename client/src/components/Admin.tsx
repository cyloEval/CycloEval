import React, { useState, useEffect } from 'react';
import {
  deleteFile,
  getFiles,
  resetDatabase,
  FileResponseShort,
} from '../lib/api';

const Admin: React.FC = () => {
  const [fileId, setFileId] = useState<number | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [files, setFiles] = useState<FileResponseShort[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated]);

  const fetchFiles = async () => {
    try {
      const files = await getFiles();
      // Trier les fichiers par ordre chronologique décroissant
      const sortedFiles = files.sort(
        (a, b) =>
          new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime(),
      );
      setFiles(sortedFiles);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      setMessage('File and associated GPS points deleted successfully');
      fetchFiles(); // Refresh the list of files
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleResetDatabase = async () => {
    try {
      await resetDatabase();
      setMessage('Database reset successfully');
      fetchFiles(); // Refresh the list of files
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleLogin = () => {
    if (password === 'adminpassword') {
      // Replace with a secure method
      setIsAuthenticated(true);
    } else {
      setMessage('Incorrect password');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!isAuthenticated ? (
        <div className="mx-auto max-w-sm">
          <h2 className="mb-4 text-2xl">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />
          <button
            onClick={handleLogin}
            className="w-full rounded bg-blue-500 p-2 text-white"
          >
            Login
          </button>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      ) : (
        <div className="mx-auto max-w-sm">
          <h2 className="mb-4 text-2xl">Admin Panel</h2>
          {message && <p className="mt-4 text-red-500">{message}</p>}
          <h3 className="mb-4 mt-8 text-xl">Uploaded Files</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id} className="mb-2 flex justify-between">
                <span>
                  {file.filename} (Uploaded on:{' '}
                  {new Date(file.upload_time).toLocaleString()})
                </span>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="ml-4 rounded bg-red-500 p-1 text-white"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleResetDatabase}
            className="mt-4 w-full rounded bg-red-500 p-2 text-white hover:bg-red-700"
          >
            Reset Database
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
