import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import FileUploadMenu from './components/upload/FileUploadMenu';
import Contact from './components/header/Contact';
import Contribution from './components/contribution';
import Map from './components/map/Map';
import Admin from './components/Admin';

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [refreshMap, setRefreshMap] = useState(false);

  const handleCancelUpload = () => {
    setShowUpload(false);
  };

  const handleContinueUpload = () => {
    setShowUpload(false);
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    setRefreshMap(true);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  const handleMapRefresh = () => {

    setRefreshMap(false);


  };

  return (
    <div className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat">
      <Header onUploadClick={toggleUpload} />
      {showUpload && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50">
          <FileUploadMenu
            onCancel={handleCancelUpload}
            onContinue={handleContinueUpload}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      )}
      <Map refreshMap={refreshMap} onRefresh={handleMapRefresh} />
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
