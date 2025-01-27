import React from "react";
import { useNavigate } from "react-router-dom";

type ActionButtonsProps = {
  onCancel: () => void;
  onContinue: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onContinue,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-2.5 mt-5">
      <button
        className="p-2.5 bg-[#8a4a7d] text-white rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#d6006e]"
        onClick={() => {
          onCancel();
          navigate("/");
        }}
      >
        Annuler l'import
      </button>
      <button
        className="p-2.5 bg-[#8a4a7d] text-white rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#d6006e]"
        onClick={onContinue}
      >
        Continuer
      </button>
    </div>
  );
};

export default ActionButtons;
