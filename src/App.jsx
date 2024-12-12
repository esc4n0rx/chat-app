import React from 'react';
import ChatContainer from './components/ChatContainer';
import './App.css';

const App = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden">
    <div className="h-full w-full max-w-4xl flex flex-col">
      <ChatContainer />
    </div>
  </div>
);

export default App;
