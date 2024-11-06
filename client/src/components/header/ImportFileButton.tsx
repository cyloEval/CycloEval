import React from "react";
import Button from "./Button";

type importFileButtonProps = {
  isSignedIn: boolean;
  handleUploadClick: () => void;
};

const ImportFileButton: React.FC<importFileButtonProps> = ({
  isSignedIn,
  handleUploadClick,
}) => (
  <Button
    onClick={() => (isSignedIn ? handleUploadClick() : alert("Sign in before"))}
  >
    Importer un fichier
  </Button>
);

export default ImportFileButton;
