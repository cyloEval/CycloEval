import React from "react";


type UploadButtonProps ={
  onFileUpload: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({onFileUpload}) => (
  <button className="p-2.5 bg-[#8a4a7d] text-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition-transform duration-200 text-center hover:bg-[#ffe6f2] hover:scale-105"
  onClick={onFileUpload}
  >
    Déposer le fichier
    <span> ⬇️</span>
  </button>
);

export default UploadButton;
