import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Header from './components/header/Header';
import FileUploadMenu from './components/upload/FileUploadMenu';
import Contact from './components/header/Contact';
import Contribution from './components/contribution';
import { AuthProvider } from './components/auth/AuthContext';
import MapContainer from './components/map/MapContainer';

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [showTheme, setShowTheme] = useState(false); // Nouvel etat pour la thematique
  const navigate = useNavigate();

  const handleCancelUpload = () => {
    setShowUpload(false);
  };

  const handleContinueUpload = () => {
    setShowUpload(false);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  return (
    <AuthProvider>
      <div className="relative h-screen w-screen bg-cover bg-center bg-no-repeat overflow-hidden">
        <Header onUploadClick={toggleUpload} />
        {showUpload && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50">
            <FileUploadMenu
              onCancel={handleCancelUpload}
              onContinue={handleContinueUpload}
            />
          </div>
        )}
        <div className='h-full" w-full'>
          <MapContainer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contribution" element={<Contribution />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
