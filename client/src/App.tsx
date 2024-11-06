
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Header from './components/header/Header';

import MapComponent from './components/map/Map';
import FileUpload from './components/upload/FileUpload';
import Footer from './components/Footer';
import Contribution from './components/contribution';
import { AuthProvider } from "./components/auth/AuthContext";

function App() {
    const [showUpload, setShowUpload] = useState(false);
    const [showTheme, setShowTheme] = useState(false); // Nouvel etat pour la thematique
    const navigate = useNavigate();




  const handleCancelUpload = () => {
    setShowUpload(false);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
    };



  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", "1"); // Replace with the actual user ID

    try {
      const response = await fetch("/importSensorData", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      setShowUpload(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <AuthProvider>
      <div
        className="relative h-screen w-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/appVelo.jpg')" }}
      >
        <Header onUploadClick={toggleUpload} />
        <MapComponent />
        {showUpload && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <FileUpload
              onCancel={handleCancelUpload}
              onFileUpload={handleFileUpload}
            />
          </>
        )}
        <Footer />
        <div className=" p-3.5 m-20 bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center" style={{width:"20%"}}
        onClick={()=>navigate('/contribution')}
        >
        Comment contribuer
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
                <Route path="/import" element={<FileUpload />} />
            </Routes>
        </Router>
    );
}
