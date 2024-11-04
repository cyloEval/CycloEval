import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <button
    className={`px-4 py-1 bg-purple-900 text-white border border-dotted border-white rounded-full cursor-pointer hover:scale-115 hover:bg-purple-500 transition-transform ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
