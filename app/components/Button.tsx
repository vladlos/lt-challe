import React from "react";
import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string | string[];
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  className,
  onClick,
  children,
}) => {
  const buttonClasses = classNames(
    "w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    className
  );
  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
