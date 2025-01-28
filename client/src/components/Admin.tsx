import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './header/Button';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const files = await response.json();
      const sortedFiles = files.sort(
        (a, b) => new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
      );
      setFiles(sortedFiles);
    } catch (error) {
      setMessage('Error fetching files');
    }
  };

  const handleLogin = () => {
    if (password === 'pass') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-14 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="pl-4 pt-1 text-xl italic">
            <Button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-800"
            >
              Accueil
            </Button>
          </div>
          <p className="mt-[-34px] text-center text-xl italic">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
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
              <Button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-800"
              >
                Login
              </Button>
              {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
          ) : (
            <div>
              <h2 className="mb-4 text-2xl">Fichiers uploadés</h2>
              {message && <p className="mt-4 text-red-500">{message}</p>}
              <ul className="space-y-2">
                {files.map((file) => (
                  <li key={file.id} className="flex justify-between items-center">
                    <span>
                      {file.filename} (Uploaded: {new Date(file.upload_time).toLocaleString()})
                    </span>
                    <Button
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-600 hover:bg-red-800"
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  onClick={handleResetDatabase}
                  className="w-full bg-red-600 hover:bg-red-800"
                >
                  Reset Database
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;