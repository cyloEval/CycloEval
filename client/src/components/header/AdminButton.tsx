import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function AdminButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/admin')}
      className="bg-blue-600 hover:bg-blue-800"
    >
      Admin Panel
    </Button>
  );
}

export default AdminButton;