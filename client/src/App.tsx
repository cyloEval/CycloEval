import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import FileUploadMenu from './components/upload/FileUploadMenu';
import Contact from './components/header/Contact';
import Contribution from './components/contribution';
import MapContainer from './components/map/MapContainer';

function App() {
  const [showUpload, setShowUpload] = useState(false);

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
    <div className="fixed h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat">
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
