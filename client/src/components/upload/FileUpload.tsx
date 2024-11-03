import React from "react";

type FileUploadProps = {
  onCancel: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onCancel }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80%] w-[1000px] h-[200px] p-5 bg-white bg-opacity-85 rounded-lg shadow-lg text-center z-50">
      <div className="font-bold uppercase mb-2">Champs obligatoires *</div>
      <div className="flex justify-center gap-5 mb-5">
        <label className="p-2.5 bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition-transform duration-200 text-center hover:bg-[#ffe6f2] hover:scale-105">
          Choisir un fichier...
          <input type="file" name="file" className="hidden" />
        </label>
        <button className="p-2.5 bg-[#8a4a7d] text-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition-transform duration-200 text-center hover:bg-[#ffe6f2] hover:scale-105">
          Déposer le fichier
          <span> ⬇️</span>
        </button>
      </div>
      <div className="flex justify-between items-center p-2.5 mt-5">
        <button
          className="p-2.5 bg-[#8a4a7d] text-white rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#d6006e]"
          onClick={onCancel}
        >
          Annuler l'import
        </button>
        <button className="p-2.5 bg-[#8a4a7d] text-white rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#d6006e]">
          Continuer
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
