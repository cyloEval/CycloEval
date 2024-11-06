import React from "react";
import Button from "./Button";

const ContactButton: React.FC = () => (
  <Button onClick={() => alert("Contact clicked")} >Contact</Button>
);

export default ContactButton;
