import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface LoginProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token); 
        navigate('/users'); 
      } else {
        toast.error(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro inesperado, tente novamente!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white rounded-md shadow-md w-full max-w-sm">
        <div className="flex items-center justify-center mb-4">
          <img src="/sps.png" alt="SPS Logo" className="w-12 h-12 mr-3" />
          <p className="text-3xl">SPS TEST</p>
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded-md"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2 w-full mb-4"
          />
        </div>
        <button onClick={handleLogin} className="bg-blue-500 rounded-md text-white p-2 w-full">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
