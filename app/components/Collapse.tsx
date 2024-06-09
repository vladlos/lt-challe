import React, { useState } from "react";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
}

const generateRandomColor = (): number[] => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return [red, green, blue];
};

const Collapse: React.FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [randomColor] = useState(generateRandomColor());

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="border rounded mb-2"
      style={{ backgroundColor: `rgba(${randomColor}, 0.2)` }}
    >
      <div
        className="flex items-center justify-between px-2 py-1 cursor-pointer"
        onClick={toggleCollapse}
      >
        <h2 className="text-sm lowercase font-mono">{title}</h2>
        <svg
          className={`w-6 h-6 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && <div className="px-2">{children}</div>}
    </div>
  );
};

export default Collapse;
