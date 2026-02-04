
import React from 'react';

interface CodeDisplayProps {
  content: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ content }) => {
  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[600px] border border-slate-700 shadow-inner">
      <pre className="text-slate-300">
        <code>{content}</code>
      </pre>
    </div>
  );
};
