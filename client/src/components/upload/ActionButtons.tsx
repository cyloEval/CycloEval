import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="mt-5 flex items-center justify-between p-2.5">
      <button
        className="cursor-pointer rounded-lg bg-blue-600 p-2.5 text-white transition-colors duration-300 hover:bg-blue-800"
        onClick={() => {
          onCancel();
          navigate('/');
        }}
      >
        Annuler l'import
      </button>
      <button
        className="cursor-pointer rounded-lg bg-blue-600 p-2.5 text-white transition-colors duration-300 hover:bg-blue-800"
        onClick={onContinue}
      >
        Continuer
      </button>
    </div>
  );
};

export default ActionButtons;
