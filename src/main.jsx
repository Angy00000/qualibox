import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Accueil, Cadre, MonEntreprise, PageOutil } from './pages.jsx';
import './styles.css';

function HautDePage() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HautDePage />
      <Routes>
        <Route element={<Cadre />}>
          <Route index element={<Accueil />} />
          <Route path="outil/:id" element={<PageOutil />} />
          <Route path="mon-entreprise" element={<MonEntreprise />} />
          <Route path="*" element={<Accueil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
