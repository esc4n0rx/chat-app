import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { sendMessage } from '../services/groqApi';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaEyeSlash, FaBars } from 'react-icons/fa';

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
          chat.id === selectedChatId
            ? { ...chat, messages: updatedMessages }
            : chat
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
      const botMessage = { role: 'assistant', content: response };

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
    <div className="flex h-screen w-screen max-w-full bg-gray-950 text-gray-100 overflow-hidden">
      {/* Barra lateral recolhível */}
      <div
        className={`bg-gray-900 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'w-64' : 'w-0'
        } max-w-full flex flex-col`}
      >
        {sidebarOpen && (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4">Minhas Conversas</h2>

            <button
              onClick={handleNewChat}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 mb-4 rounded-lg"
            >
              Novo Chat
            </button>

            <div className="flex-grow overflow-y-auto border-t border-gray-800 pt-4">
              {savedChats.length === 0 ? (
                <p className="text-gray-300">Nenhuma conversa salva</p>
              ) : (
                <ul>
                  {savedChats.map((chat) => {
                    const isDeleting = deletingChatId === chat.id;
                    return (
                      <li
                        key={chat.id}
                        className={`mb-2 transition-transform transform-gpu ${
                          isDeleting
                            ? 'opacity-0 scale-75 duration-300'
                            : 'duration-200'
                        }`}
                      >
                        <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800">
                          <button
                            className="text-left flex-grow"
                            onClick={() => handleSelectChat(chat.id)}
                          >
                            <span
                              className={`block ${
                                selectedChatId === chat.id ? 'font-bold' : ''
                              }`}
                            >
                              {chat.title}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteChat(chat.id)}
                            className="text-red-400 hover:text-red-600 ml-2"
                          >
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

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Navbar superior */}
        <div className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
            >
              {sidebarOpen ? <FaEyeSlash /> : <FaBars />}
            </button>
            <h1 className="text-xl font-bold">Sophos AI</h1>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-grow p-4 overflow-y-auto break-words">
          <ChatMessages messages={messages} />
          {isTyping && (
            <div className="flex justify-start text-gray-400">
              <span className="animate-pulse">Sophos está respondendo...</span>
            </div>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
