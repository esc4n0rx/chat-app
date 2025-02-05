// App.jsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ChatContainer from './components/ChatContainer';
import './App.css';
import { FaTimes } from 'react-icons/fa';

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
      .from('sophosusers')
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
    const { error } = await supabase.from('sophosusers').insert([
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
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-75 -z-10"></div>

      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent animate-fadeInDown">
          Hermes AI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fadeIn">
          Seu assistente pessoal inteligente, sempre pronto para ajudar com tarefas do dia a dia, cálculos e orientações práticas.
        </p>
      </header>

      <main className="w-full max-w-5xl px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeInUp">
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-blue-400">Resolução de Problemas</h3>
          <p className="text-gray-400 mt-2">
            Encontre soluções para desafios do dia a dia com respostas rápidas e precisas.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-blue-400">Cálculos Avançados</h3>
          <p className="text-gray-400 mt-2">
            Realize cálculos complexos e obtenha resultados de forma simples e intuitiva.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-blue-400">Organização Pessoal</h3>
          <p className="text-gray-400 mt-2">
            Gerencie suas tarefas e compromissos com dicas e ferramentas de organização.
          </p>
        </div>
      </main>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-12 px-8 py-4 bg-blue-500 rounded-full text-xl font-medium hover:bg-blue-600 transition-all shadow-lg animate-bounce"
      >
        Vamos Começar
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 relative">

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            {isRegistering ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-6">Registrar</h2>
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mb-4 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full mb-4 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mb-4 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mb-6 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 transition-colors"
                />
                <button
                  onClick={handleRegister}
                  className="w-full px-4 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                >
                  Registrar
                </button>
                <p
                  className="mt-4 text-center text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                  onClick={() => setIsRegistering(false)}
                >
                  Já tem uma conta? Faça Login
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mb-4 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mb-6 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 transition-colors"
                />
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  Login
                </button>
                <p
                  className="mt-4 text-center text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                  onClick={() => setIsRegistering(true)}
                >
                  Não tem uma conta? Registre-se aqui
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
