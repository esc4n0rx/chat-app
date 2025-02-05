import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaTimes } from 'react-icons/fa';

const ChatMessages = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-300`}
        >
          <div
            className={`max-w-2xl p-4 rounded-lg shadow-md text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeContent = String(children).replace(/\n$/, '');
                  if (!inline && match) {
                    return <CodeBlockWithModal code={codeContent} language={match[1]} {...props} />;
                  } else {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

const CodeBlockWithModal = ({ code, language }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={handleOpenModal}>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
        <SyntaxHighlighter style={oneDark} language={language} PreTag="div" className="rounded-md overflow-hidden">
          {code}
        </SyntaxHighlighter>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 animate-fadeIn">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-700 relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors">
              <FaTimes size={20} />
            </button>
            <h2 className="text-lg font-bold text-white mb-4">Código ({language})</h2>
            <SyntaxHighlighter style={oneDark} language={language} PreTag="div" className="rounded-md overflow-auto max-h-96">
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessages;
