import React, { useState } from "react";
import logoEtuderecup from "/logoEtudeRecup.jpg";
import SignInButton from "./auth/SignInButton";
import { useAuth } from "./auth/AuthContext";

type HeaderProps = {
  onUploadClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  const { isSignedIn, userEmail, toggleSignIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(!showSignIn);
  };

  const handleUploadClick = () => {
    setShowUpload(!showUpload);
    onUploadClick();
  };

  return (
    <header className="flex w-full h-16 justify-between items-center p-2.5 bg-purple-700 border-b border-gray-300">
      <div className="flex w-1/5 border border-white rounded-sm h-15 hover:scale-115 transition-transform">
        <img src={logoEtuderecup} className="logo" alt="logo_etude_recup" />
      </div>

      {isSignedIn && userEmail ? (
        <div>
          <p className="text-white text-lg">Bienvenue {userEmail}</p>
        </div>
      ) : null}

      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-1 bg-purple-900 text-white border border-dotted border-white rounded-full cursor-pointer hover:scale-115 hover:bg-purple-500 transition-transform"
          onClick={() =>
            isSignedIn ? handleUploadClick() : alert("Sign in before")
          }
        >
          Importer un fichier
        </button>
        {isSignedIn ? (
          <button
            className="px-4 py-1 bg-purple-900 text-white border border-dotted border-white rounded-full cursor-pointer hover:scale-115 hover:bg-purple-500 transition-transform"
            onClick={toggleSignIn}
          >
            Déconnexion
          </button>
        ) : (
          <>
            <button
              className="px-4 py-1 bg-purple-900 text-white border border-dotted border-white rounded-full cursor-pointer hover:scale-115 hover:bg-purple-500 transition-transform"
              onClick={handleSignInClick}
            >
              Sign In
            </button>
            {showSignIn && (
              <div className="absolute top-16 right-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                <SignInButton />
              </div>
            )}
          </>
        )}
        <button className="px-4 py-1 bg-purple-900 text-white border border-dotted border-white rounded-full cursor-pointer hover:scale-115 hover:bg-purple-500 transition-transform">
          Contact
        </button>
      </div>
    </header>
  );
};

export default Header;
