import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !String(children).includes('\n');
            return !isInline && match ? (
              <pre className="rounded-lg bg-gray-800 p-4 overflow-x-auto">
                <code
                  className={className}
                  {...props}
                  ref={(el) => {
                    if (el) {
                      hljs.highlightElement(el);
                    }
                  }}
                >
                  {children}
                </code>
              </pre>
            ) : (
              <code className={`${className} bg-gray-100 px-1.5 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            );
          },
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
    </div>
  );
};

export default MarkdownViewer;
