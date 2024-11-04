import React from "react";
import Button from "./Button";

type UploadButtonProps = {
  isSignedIn: boolean;
  handleUploadClick: () => void;
};

const UploadButton: React.FC<UploadButtonProps> = ({
  isSignedIn,
  handleUploadClick,
}) => (
  <Button
    onClick={() => (isSignedIn ? handleUploadClick() : alert("Sign in before"))}
  >
    Importer un fichier
  </Button>
);

export default UploadButton;
