import React from "react";
import Button from "./Button";

type SignInButtonProps = {
  onClick: () => void;
};

const SignInButton: React.FC<SignInButtonProps> = ({ onClick }) => (
  <Button onClick={onClick}>Sign In</Button>
);

export default SignInButton;
