/**
 * QQUIZ PRODIGY - Main Entry Point
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initProtection } from './lib/protection';

// Initialiser les protections en production
if (import.meta.env.PROD) {
  initProtection();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
