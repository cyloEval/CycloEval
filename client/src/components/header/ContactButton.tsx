import Button from './Button';
import { useNavigate } from 'react-router-dom';

function ContactButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/contact')}
      className="bg-blue-600 hover:bg-blue-800"
    >
      Contact
    </Button>
  );
}

export default ContactButton;
