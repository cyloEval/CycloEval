import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function ContributionButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/contribution')}
      className="bg-blue-600 hover:bg-blue-800"
    >
      Comment contribuer
    </Button>
  );
}

export default ContributionButton;
