import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, FileText } from 'lucide-react';

interface BriefDisplayProps {
  content: string;
}

export const BriefDisplay: React.FC<BriefDisplayProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2 text-gray-700">
          <FileText className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-lg">Generated SEO Brief</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-white bg-gray-100 border border-transparent hover:border-gray-200 rounded-md transition-all duration-200"
          title="Copy Markdown"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 bg-white">
        <article className="prose prose-slate prose-lg max-w-none 
          prose-headings:text-gray-800 
          prose-a:text-primary-600 hover:prose-a:text-primary-500
          prose-pre:bg-gray-50 prose-pre:text-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:shadow-sm
          prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};