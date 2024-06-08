import React, { useState } from "react";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
}

const Collapse: React.FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded mb-4">
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer"
        onClick={toggleCollapse}
      >
        <h2 className="text-lg font-medium">{title}</h2>
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
      {isOpen && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
};

export default Collapse;
