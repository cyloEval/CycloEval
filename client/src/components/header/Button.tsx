import React from 'react';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <button
    className={`hover:scale-115 cursor-pointer rounded-full bg-purple-900 px-4 py-1 text-white transition-transform hover:bg-purple-500 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
