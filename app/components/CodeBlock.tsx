import React from 'react';
interface CodeBlockProps {
  children: string | React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  return (
    <div className="relative max-w-2xl">
      <div className="bg-gray-900 text-white p-4 rounded-md">
        <div className="overflow-x-auto">
          <pre id="code" className="text-gray-300">
            <code>{children}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
