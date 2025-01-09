import React from "react";
import Button from "./Button";

type importFileButtonProps = {
  handleUploadClick: () => void;
};

const ImportFileButton: React.FC<importFileButtonProps> = ({

  handleUploadClick,
}) => (
  <Button
    onClick={() => (handleUploadClick() )}
  >
    Importer un fichier
  </Button>
);

export default ImportFileButton;
