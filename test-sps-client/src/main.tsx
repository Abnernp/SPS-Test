import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom'; // Importando o BrowserRouter
import { ToastContainer } from 'react-toastify'; // Importando o ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importando os estilos do ToastContainer

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>  
      <App />
      <ToastContainer />  
    </Router>
  </StrictMode>,
);
