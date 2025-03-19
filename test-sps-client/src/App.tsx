import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Users from './Users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/users" element={token ? <Users token={token} /> : <Login setToken={setToken} />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
