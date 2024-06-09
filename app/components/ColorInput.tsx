import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const ColorInput: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">
        {label}:
        <input
          {...rest}
          type="color"
          className="mt-1 p-1 h-10 w-14 block bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </label>
    </div>
  );
};

export default ColorInput;
