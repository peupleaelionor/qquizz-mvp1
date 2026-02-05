/**
 * QQUIZ PRODIGY - Main Entry Point
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Désactiver temporairement la protection pour le debug
// import { initProtection } from './lib/protection';
// if (import.meta.env.PROD) {
//   initProtection();
// }

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
