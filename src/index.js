import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/AlertDialog.css';
import './components/Card.css';
import './components/Badge.css';
import './components/Drawer.css';
import './components/Pagination.css';
import './components/Toggle.css';
import './components/GuidedTour.css';
import AppRouter from './AppRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
