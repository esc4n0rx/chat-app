import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 p-4 border-t border-gray-700">
      <input
        type="text"
        className="flex-grow p-3 rounded-l-lg bg-gray-900 text-white focus:outline-none focus:ring focus:ring-blue-500 transition-all"
        placeholder="Digite sua mensagem..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;
