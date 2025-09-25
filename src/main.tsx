import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route,Router } from 'react-router-dom';
import "./styles/index.css";
import App from './App.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <BrowserRouter>

  <App />

  </BrowserRouter>
 </StrictMode>
)
