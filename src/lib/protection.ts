/**
 * QQUIZ PRODIGY - Protection System
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

// Désactiver le clic droit
export const disableRightClick = () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};

// Désactiver les raccourcis de développeur
export const disableDevTools = () => {
  document.addEventListener('keydown', (e) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
      (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
      e.preventDefault();
      return false;
    }
  });
};

// Désactiver la sélection de texte
export const disableTextSelection = () => {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
};

// Désactiver le drag and drop des images
export const disableImageDrag = () => {
  document.addEventListener('dragstart', (e) => {
    if ((e.target as HTMLElement).tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });
};

// Watermark invisible sur les images
export const addInvisibleWatermark = (canvas: HTMLCanvasElement, text: string) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.globalAlpha = 0.01;
  ctx.fillStyle = '#000';
  ctx.font = '12px Arial';
  
  for (let y = 0; y < canvas.height; y += 50) {
    for (let x = 0; x < canvas.width; x += 100) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.globalAlpha = 1;
};

// Détection de DevTools ouvert
export const detectDevTools = () => {
  const threshold = 160;
  
  const check = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      // DevTools probablement ouvert
      console.clear();
      console.log('%c⚠️ QQUIZ PRODIGY', 'font-size: 50px; color: red; font-weight: bold;');
      console.log('%cCe code est protégé. La copie est interdite.', 'font-size: 20px; color: orange;');
    }
  };
  
  setInterval(check, 1000);
};

// Obfuscation des données sensibles
export const obfuscateData = (data: string): string => {
  return btoa(encodeURIComponent(data));
};

export const deobfuscateData = (data: string): string => {
  return decodeURIComponent(atob(data));
};

// Protection contre le scraping
export const antiScraping = () => {
  // Ajouter des honeypots
  const honeypot = document.createElement('div');
  honeypot.style.display = 'none';
  honeypot.innerHTML = '<a href="/trap">Click here</a>';
  honeypot.className = 'qqp-trap';
  document.body.appendChild(honeypot);
};

// Fingerprinting basique pour identifier les utilisateurs
export const generateFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('QQUIZ PRODIGY', 2, 2);
  
  const data = canvas.toDataURL();
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
};

// Initialiser toutes les protections
export const initProtection = () => {
  if (typeof window !== 'undefined') {
    disableRightClick();
    disableDevTools();
    disableTextSelection();
    disableImageDrag();
    detectDevTools();
    antiScraping();
    
    // Message console personnalisé
    console.log('%c🎮 QQUIZ PRODIGY', 'font-size: 40px; color: #8B5CF6; font-weight: bold; text-shadow: 2px 2px 4px #000;');
    console.log('%c© 2024-2026 Tous droits réservés', 'font-size: 14px; color: #06B6D4;');
    console.log('%c⚠️ Toute tentative de copie ou modification du code est interdite et tracée.', 'font-size: 12px; color: #EF4444;');
  }
};

// Licence et copyright
export const LICENSE = {
  name: 'QQUIZ PRODIGY',
  version: '1.0.0',
  copyright: '© 2024-2026 QQUIZ PRODIGY. All rights reserved.',
  license: 'PROPRIETARY - Unauthorized copying prohibited',
  website: 'https://qquizz-mvp1.vercel.app',
  contact: 'support@qquizprodigy.com'
};
