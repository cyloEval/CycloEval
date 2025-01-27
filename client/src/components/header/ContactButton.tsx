// ContactButton.tsx

import Button from "./Button";
import { useNavigate } from "react-router-dom";

function ContactButton() {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate('/contact')}>Contact</Button>
  );
}

export default ContactButton;