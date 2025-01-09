import { useState } from "react";
import ContactButton from "./ContactButton";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import ImportFileButton from "./ImportFileButton";
import { useAuth } from "../auth/AuthContext";
import SignInForm from "../auth/SignInForm";
import logoEtuderecup from "/logoEtudeRecup.jpg";
import { useNavigate } from "react-router-dom";

import ContributionButton from "./ContributionButton";

type HeaderProps = {
  onUploadClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  const { isSignedIn, userEmail, toggleSignIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  

  const handleSignInClick = () => {
    setShowSignIn(!showSignIn);
  };

  const handleUploadClick = () => {
    onUploadClick();
  };

  const signOut = () => {
    toggleSignIn();
    setShowSignIn(false);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-purple-700 text-white h-20">
      <div className="flex w-1/6 border border-white rounded-sm h-15 hover:scale-115 transition-transform">
        <img src={logoEtuderecup} className="logo" alt="logo_etude_recup" />
      </div>
        <div>
          <p className="text-white text-lg">Bienvenue !</p>
        </div>

      <div className="flex items-center space-x-4 mr-4">
        <ContributionButton/>
        
        <ImportFileButton
          handleUploadClick={handleUploadClick}
        />
        <ContactButton />
      </div>
    </header>
  );
};

export default Header;
