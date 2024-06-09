import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string | string[];
  onClick?: () => void;
  small?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  className,
  onClick,
  children,
  small = false,
}) => {
  const buttonClasses = classNames(
    small
      ? 'text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded-md shadow-md border hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      : 'w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'flex flex-row items-center justify-center',
    className
  );
  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
