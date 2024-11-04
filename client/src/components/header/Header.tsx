import { useState } from "react";
import ContactButton from "./ContactButton";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import UploadButton from "./UploadButton";
import { useAuth } from "../auth/AuthContext";
import SignInForm from "../auth/SignInForm";
import logoEtuderecup from "/logoEtudeRecup.jpg";

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
      <div className="flex w-1/5 border border-white rounded-sm h-15 hover:scale-115 transition-transform">
        <img src={logoEtuderecup} className="logo" alt="logo_etude_recup" />
      </div>
      {isSignedIn && userEmail ? (
        <div>
          <p className="text-white text-lg">Bienvenue {userEmail}</p>
        </div>
      ) : null}
      <div className="flex items-center space-x-4">
        <UploadButton
          isSignedIn={isSignedIn}
          handleUploadClick={handleUploadClick}
        />
        {isSignedIn ? (
          <SignOutButton onClick={signOut} />
        ) : (
          <>
            <SignInButton onClick={handleSignInClick} />
            {showSignIn && (
              <div className="absolute top-16 right-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                <SignInForm />
              </div>
            )}
          </>
        )}
        <ContactButton />
      </div>
    </header>
  );
};

export default Header;
