import React, { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { sendMessage } from '../services/groqApi';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaEyeSlash, FaBars } from 'react-icons/fa';

const TypingIndicator = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span className="italic">Hermes está respondendo{dots}</span>;
};

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deletingChatId, setDeletingChatId] = useState(null);

  const updateCurrentChatMessages = (updatedMessages) => {
    setMessages(updatedMessages);
    if (selectedChatId) {
      setSavedChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId ? { ...chat, messages: updatedMessages } : chat
        )
      );
    }
  };

  const handleSendMessage = async (input) => {
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    if (!selectedChatId) {
      const chatTitle = input.length > 30 ? `${input.slice(0, 30)}...` : input;
      const newChat = {
        id: uuidv4(),
        title: chatTitle.trim() !== '' ? chatTitle : 'Nova Conversa',
        messages: newMessages,
      };
      setSavedChats((prev) => [...prev, newChat]);
      setSelectedChatId(newChat.id);
      updateCurrentChatMessages(newMessages);
    } else {
      updateCurrentChatMessages(newMessages);
    }

    try {
      setIsTyping(true);
      const response = await sendMessage(newMessages);
      const cleanedResponse = response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const botMessage = { role: 'assistant', content: cleanedResponse };
      updateCurrentChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectChat = (chatId) => {
    const chat = savedChats.find((c) => c.id === chatId);
    if (chat) {
      setMessages([...chat.messages]);
      setSelectedChatId(chatId);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDeleteChat = (chatId) => {
    setDeletingChatId(chatId);
    setTimeout(() => {
      setSavedChats((prevChats) => prevChats.filter((c) => c.id !== chatId));
      if (chatId === selectedChatId) {
        setMessages([]);
        setSelectedChatId(null);
      }
      setDeletingChatId(null);
    }, 300);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedChatId(null);
  };

  return (
    <div className="flex h-screen w-screen max-w-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 overflow-hidden">

      <div className={`bg-gray-900 transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'} flex flex-col`}>
        {sidebarOpen && (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Minhas Conversas</h2>
            <button
              onClick={handleNewChat}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 mb-4 rounded-lg transition-all"
            >
              Novo Chat
            </button>
            <div className="flex-grow overflow-y-auto border-t border-gray-700 pt-4">
              {savedChats.length === 0 ? (
                <p className="text-gray-400 italic">Nenhuma conversa salva</p>
              ) : (
                <ul>
                  {savedChats.map((chat) => {
                    const isDeleting = deletingChatId === chat.id;
                    return (
                      <li key={chat.id} className={`mb-2 transition-transform transform-gpu ${isDeleting ? 'opacity-0 scale-75 duration-300' : 'duration-200'}`}>
                        <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800">
                          <button className="text-left flex-grow focus:outline-none" onClick={() => handleSelectChat(chat.id)}>
                            <span className={`block ${selectedChatId === chat.id ? 'font-bold text-blue-400' : 'text-gray-300'}`}>
                              {chat.title}
                            </span>
                          </button>
                          <button onClick={() => handleDeleteChat(chat.id)} className="text-red-400 hover:text-red-600 ml-2 focus:outline-none">
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0">

        <div className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded focus:outline-none">
              {sidebarOpen ? <FaEyeSlash /> : <FaBars />}
            </button>
            <h1 className="text-xl font-bold">Hermes AI</h1>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto break-words">
          <ChatMessages messages={messages} />
          {isTyping && (
            <div className="flex justify-start mt-4">
              <TypingIndicator />
            </div>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
