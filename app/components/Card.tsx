import React, { ReactNode } from "react";
import classNames from "classnames";

interface CardProps {
  children: ReactNode;
  className?: string | string[];
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  const cardClasses = classNames("bg-white p-4 rounded shadow-md", className);

  return <div className={cardClasses}>{children}</div>;
};

export default Card;
