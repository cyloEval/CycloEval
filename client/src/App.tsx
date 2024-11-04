import { useState } from "react";
import Header from "./components/header/Header";
import MapComponent from "./components/map/Map";
import FileUpload from "./components/upload/FileUpload";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/auth/AuthContext";

function App() {
  const [showUpload, setShowUpload] = useState(false);

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  const handleCancelUpload = () => {
    setShowUpload(false);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", "1"); // Replace with the actual user ID

    try {
      const response = await fetch("/importSensorData", {
        method: "POST",
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
      </div>
    </AuthProvider>
  );
}

export default App;
