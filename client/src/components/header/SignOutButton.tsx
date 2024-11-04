import React from "react";
import Button from "./Button";

type SignOutButtonProps = {
  onClick: () => void;
};

const SignOutButton: React.FC<SignOutButtonProps> = ({ onClick }) => (
  <Button onClick={onClick}>Déconnexion</Button>
);

export default SignOutButton;
