import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ChevronUp } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
}

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: unknown;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const isInline = !String(children).includes('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isInline) {
    return (
      <code className={`${className} bg-gray-100 px-1.5 py-0.5 rounded text-sm`} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative rounded-lg bg-gray-100 border border-gray-300 mb-4">
      <div className="flex justify-end items-center px-4 py-2 border-b border-gray-200">
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto whitespace-pre-wrap break-words">
        <code
          className="!bg-transparent !text-gray-800"
          {...props}
        >
          {children}
        </code>
      </pre>
    </div>
  );
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="prose prose-slate max-w-none relative">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 text-gray-800" {...props} />,
          h2: ({ ...props }) => <h2 className="text-2xl font-semibold mb-3 mt-5 text-gray-800" {...props} />,
          h3: ({ ...props }) => <h3 className="text-xl font-medium mb-2 mt-4 text-gray-800" {...props} />,
          p: ({ ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-700" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-700" {...props} />,
          li: ({ ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-orange-400 pl-4 py-1 my-4 bg-gray-50 italic text-gray-600" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-gray-100" {...props} />,
          th: ({ ...props }) => <th className="border border-gray-300 px-4 py-2 text-left" {...props} />,
          td: ({ ...props }) => <td className="border border-gray-300 px-4 py-2" {...props} />,
          img: ({ ...props }) => <img className="max-w-full h-auto rounded-lg shadow-md my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
      
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#ff6b35] text-white p-4 rounded-full shadow-xl hover:bg-[#e55a2b] transition-all z-50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default MarkdownViewer;
