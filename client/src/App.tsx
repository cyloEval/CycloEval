import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Header from './components/header/Header';
import FileUploadMenu from './components/upload/FileUploadMenu';
import Footer from './components/Footer';
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
      <div className="relative h-screen w-screen bg-cover bg-center bg-no-repeat">
        <Header onUploadClick={toggleUpload} />
        {showUpload && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50">
            <FileUploadMenu
              onCancel={handleCancelUpload}
              onContinue={handleContinueUpload}
            />
          </div>
        )}
        <div className='h-[100vh]" w-[100%]'>
          <MapContainer />
        </div>
        {/* <Footer />
        <div
          className="m-20 transform cursor-pointer rounded-lg border-2 border-[#8a4a7d] bg-white p-3.5 text-center transition duration-300 ease-in-out hover:bg-gray-100"
          style={{ width: '20%' }}
          onClick={() => navigate('/contribution')}
        >
          Comment contribuer
        </div> */}
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
      </Routes>
    </Router>
  );
}
