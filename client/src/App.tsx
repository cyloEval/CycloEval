import { useState } from "react";
import Header from "./components/Header";
import MapComponent from "./components/map/Map";
import FileUpload from "./components/upload/FileUpload";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/auth/AuthContext";


function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [showTheme, setShowTheme] = useState(false); // Nouvel état pour la thématique


  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  const toggleTheme = () => {
    setShowTheme(!showTheme);
  };

  const handleCancelUpload = () => {
    setShowUpload(false);
  };

  return (
    <AuthProvider>
      <div
        className="relative h-screen w-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/appVelo.jpg')" }}
      >
        <Header onUploadClick={toggleUpload} />
        <div className="flex flex-row items-start">
          {showTheme && (
            <div className="bg-white p-4 rounded-lg relative flex-1/2 shadow-lg mr-5">
              <div className="flex items-center justify-between">
                <span>Thématique de la Carte</span>
                <button
                  className="ml-2 bg-transparent border-none cursor-pointer text-lg"
                  onClick={toggleTheme}
                >
                  X
                </button>
              </div>
              <div className="mt-4">
                <p>État des pistes cyclables :</p>
                <ul>
                  <li>
                    <b>Piste 1 :</b> Bon
                  </li>
                  <li>
                    <b>Piste 2 :</b> Moyen
                  </li>
                  <li>
                    <b>Piste 3 :</b> Mauvais
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div
            className={`${
              showUpload ? "blur-sm transition-filter duration-300" : ""
            } flex-1`}
          >
            <MapComponent />
          </div>
        </div>
        {showUpload && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <FileUpload onCancel={handleCancelUpload} />
          </>
        )}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
