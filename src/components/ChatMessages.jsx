import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessages = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-2xl p-4 rounded-lg shadow-md text-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
            }`}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeContent = String(children).replace(/\n$/, '');

                  if (!inline && match) {
                    return (
                      <CodeBlockWithModal
                        code={codeContent}
                        language={match[1]}
                        {...props}
                      />
                    );
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

  const handleCopy = async () => {
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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={handleOpenModal} // Clique abre o modal
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evita conflito entre clique no bloco e no botão
            handleCopy();
          }}
          className="absolute right-2 top-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="bg-gray-900 p-6 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Código</h2>
          <SyntaxHighlighter style={oneDark} language={language} PreTag="div">
            {code}
          </SyntaxHighlighter>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ChatMessages;
