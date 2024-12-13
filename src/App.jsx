// Importações
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ChatContainer from './components/ChatContainer';
import './App.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleLogin = async () => {
    const { email, password } = formData;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      alert('Erro no login: Email ou senha inválidos.');
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleRegister = async () => {
    const { name, username, email, password } = formData;
    const { error } = await supabase.from('users').insert([
      { name, username, email, password }
    ]);

    if (error) {
      alert('Erro no registro: ' + error.message);
    } else {
      alert('Registro bem-sucedido!');
      setIsRegistering(false);
    }
  };

  if (isLoggedIn) {
    return <ChatContainer />;
  }

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
        Sophos AI
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-400 text-center max-w-xl">
        Seu assistente inteligente de código, otimizado para desenvolvedores que buscam eficiência e precisão.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-blue-400">Autocompletar Inteligente</h3>
          <p className="text-gray-400 mt-2">Sugestões contextuais e precisas enquanto você digita código.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-blue-400">Depuração Automática</h3>
          <p className="text-gray-400 mt-2">Identifique e corrija erros em seu código com facilidade.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-blue-400">Documentação Instantânea</h3>
          <p className="text-gray-400 mt-2">Gere documentação clara e concisa a partir do seu código.</p>
        </div>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-8 px-6 py-3 bg-blue-500 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors"
      >
        Vamos Começar
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 transform transition-transform scale-95 animate-fade-in">
            {isRegistering ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-4">Registrar</h2>
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mb-6 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  onClick={handleRegister}
                  className="w-full px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Registrar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mb-6 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Login
                </button>
                <p
                  className="mt-4 text-center text-gray-400 hover:text-gray-200 cursor-pointer"
                  onClick={() => setIsRegistering(true)}
                >
                  Não tem uma conta? Registre-se aqui
                </p>
              </>
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full text-center text-gray-400 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
