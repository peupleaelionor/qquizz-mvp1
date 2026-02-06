/**
 * QQUIZ PRODIGY - Animation System V8
 * Animations ultra-dynamiques avec GSAP
 * Transitions fluides entre écrans
 */

import gsap from 'gsap';

// ============================================
// ANIMATIONS DE PAGE
// ============================================

/** Animation d'entrée de page avec stagger */
export function animatePageIn(container: HTMLElement) {
  const elements = container.querySelectorAll('[data-animate]');
  gsap.fromTo(elements, 
    { opacity: 0, y: 30, scale: 0.95 },
    { 
      opacity: 1, y: 0, scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out'
    }
  );
}

/** Animation de sortie de page */
export function animatePageOut(container: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    gsap.to(container, {
      opacity: 0, y: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: resolve
    });
  });
}

// ============================================
// ANIMATIONS DE CARTES DE CATÉGORIES
// ============================================

/** Animation d'entrée des cartes de catégories avec stagger */
export function animateCategoryCards(cards: NodeListOf<Element> | HTMLElement[]) {
  gsap.fromTo(cards,
    { opacity: 0, y: 40, scale: 0.85, rotateX: 15 },
    {
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'back.out(1.2)'
    }
  );
}

/** Animation hover sur une carte */
export function animateCardHover(card: HTMLElement, isEntering: boolean) {
  gsap.to(card, {
    scale: isEntering ? 1.05 : 1,
    y: isEntering ? -5 : 0,
    boxShadow: isEntering 
      ? '0 20px 40px rgba(139, 92, 246, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.out'
  });
}

// ============================================
// ANIMATIONS DE QUIZ
// ============================================

/** Animation d'entrée de question */
export function animateQuestionIn(questionEl: HTMLElement) {
  gsap.fromTo(questionEl,
    { opacity: 0, x: 50, scale: 0.9 },
    { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
  );
}

/** Animation de sortie de question */
export function animateQuestionOut(questionEl: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    gsap.to(questionEl, {
      opacity: 0, x: -50, scale: 0.9,
      duration: 0.3, ease: 'power2.in',
      onComplete: resolve
    });
  });
}

/** Animation des options de réponse */
export function animateOptions(options: NodeListOf<Element> | HTMLElement[]) {
  gsap.fromTo(options,
    { opacity: 0, x: 30, scale: 0.9 },
    {
      opacity: 1, x: 0, scale: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'back.out(1.1)'
    }
  );
}

/** Animation de bonne réponse */
export function animateCorrectAnswer(button: HTMLElement) {
  const tl = gsap.timeline();
  tl.to(button, { scale: 1.08, duration: 0.15, ease: 'power2.out' })
    .to(button, { 
      scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)',
      boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)'
    });
}

/** Animation de mauvaise réponse */
export function animateWrongAnswer(button: HTMLElement) {
  gsap.to(button, {
    keyframes: [
      { x: 0 }, { x: -8 }, { x: 8 }, { x: -6 }, { x: 6 }, { x: -3 }, { x: 3 }, { x: 0 }
    ],
    duration: 0.5,
    ease: 'power2.out',
    boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
  });
}

// ============================================
// ANIMATIONS DE SCORE
// ============================================

/** Animation du score qui monte */
export function animateScoreIncrease(scoreEl: HTMLElement, from: number, to: number) {
  const obj = { value: from };
  gsap.to(obj, {
    value: to,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
      scoreEl.textContent = Math.round(obj.value).toString();
    }
  });
  
  // Pulse effect
  gsap.fromTo(scoreEl,
    { scale: 1.3, color: '#22d3ee' },
    { scale: 1, color: '#ffffff', duration: 0.5, ease: 'elastic.out(1, 0.5)' }
  );
}

/** Animation de XP gagné (popup flottant) */
export function animateXPGain(container: HTMLElement, xp: number) {
  const popup = document.createElement('div');
  popup.textContent = `+${xp} XP`;
  popup.style.cssText = `
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem; font-weight: 800;
    color: #a855f7; text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
    pointer-events: none; z-index: 100;
    font-family: 'Orbitron', sans-serif;
  `;
  container.appendChild(popup);

  gsap.fromTo(popup,
    { opacity: 1, y: 0, scale: 0.5 },
    {
      opacity: 0, y: -60, scale: 1.2,
      duration: 1.2, ease: 'power2.out',
      onComplete: () => popup.remove()
    }
  );
}

/** Animation de points gagnés (popup flottant) */
export function animatePointsGain(container: HTMLElement, points: number, grade: string) {
  const colors: Record<string, string> = {
    perfect: '#22d3ee',
    great: '#a855f7',
    good: '#22c55e',
    ok: '#eab308',
    miss: '#ef4444'
  };
  
  const popup = document.createElement('div');
  popup.textContent = points > 0 ? `+${points}` : `${points}`;
  popup.style.cssText = `
    position: absolute; top: 40%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem; font-weight: 900;
    color: ${colors[grade] || '#ffffff'};
    text-shadow: 0 0 20px ${colors[grade] || '#ffffff'}80;
    pointer-events: none; z-index: 100;
    font-family: 'Orbitron', sans-serif;
  `;
  container.appendChild(popup);

  gsap.fromTo(popup,
    { opacity: 1, y: 0, scale: 0.3 },
    {
      opacity: 0, y: -80, scale: 1.5,
      duration: 1, ease: 'power2.out',
      onComplete: () => popup.remove()
    }
  );
}

// ============================================
// ANIMATIONS DE TIMER
// ============================================

/** Animation du timer qui pulse quand il reste peu de temps */
export function animateTimerUrgent(timerEl: HTMLElement) {
  gsap.to(timerEl, {
    scale: 1.15,
    color: '#ef4444',
    textShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  });
}

// ============================================
// ANIMATIONS DE COMBO
// ============================================

/** Animation de combo streak */
export function animateCombo(comboEl: HTMLElement, comboCount: number) {
  const intensity = Math.min(comboCount / 10, 1);
  
  gsap.fromTo(comboEl,
    { scale: 1.5 + intensity * 0.5, opacity: 1 },
    { 
      scale: 1, opacity: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)'
    }
  );
}

// ============================================
// ANIMATIONS DE RÉSULTATS
// ============================================

/** Animation de l'écran de résultats */
export function animateResults(container: HTMLElement) {
  const elements = container.querySelectorAll('[data-result]');
  
  gsap.fromTo(elements,
    { opacity: 0, y: 30, scale: 0.9 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.5,
      stagger: 0.12,
      ease: 'back.out(1.2)'
    }
  );
}

/** Animation du rang (S, A, B, C, D) */
export function animateRank(rankEl: HTMLElement) {
  gsap.fromTo(rankEl,
    { scale: 0, rotation: -180, opacity: 0 },
    {
      scale: 1, rotation: 0, opacity: 1,
      duration: 0.8,
      ease: 'back.out(2)'
    }
  );
}

/** Animation de la barre de progression */
export function animateProgressBar(barEl: HTMLElement, targetWidth: number) {
  gsap.fromTo(barEl,
    { width: '0%' },
    { width: `${targetWidth}%`, duration: 1.2, ease: 'power2.out' }
  );
}

// ============================================
// ANIMATIONS DE LEADERBOARD
// ============================================

/** Animation d'entrée du podium */
export function animatePodium(podiumItems: NodeListOf<Element> | HTMLElement[]) {
  gsap.fromTo(podiumItems,
    { opacity: 0, y: 60, scale: 0.8 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.5)'
    }
  );
}

// ============================================
// ANIMATIONS DE PROFIL
// ============================================

/** Animation des stats du profil */
export function animateProfileStats(stats: NodeListOf<Element> | HTMLElement[]) {
  gsap.fromTo(stats,
    { opacity: 0, scale: 0.8, y: 20 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.3)'
    }
  );
}

// ============================================
// ANIMATIONS UTILITAIRES
// ============================================

/** Animation de particules (confetti-like) */
export function animateParticles(container: HTMLElement, count: number = 20) {
  const colors = ['#a855f7', '#22d3ee', '#ec4899', '#22c55e', '#eab308', '#f97316'];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      top: 50%; left: 50%;
      pointer-events: none; z-index: 100;
    `;
    container.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      rotation: Math.random() * 720,
      opacity: 0,
      scale: 0,
      duration: 1 + Math.random() * 0.5,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    });
  }
}

/** Animation de shake (erreur) */
export function animateShake(element: HTMLElement) {
  gsap.to(element, {
    keyframes: [
      { x: 0 }, { x: -10 }, { x: 10 }, { x: -8 }, { x: 8 }, { x: -4 }, { x: 4 }, { x: 0 }
    ],
    duration: 0.5,
    ease: 'power2.out'
  });
}

/** Animation de pulse (notification) */
export function animatePulse(element: HTMLElement) {
  gsap.fromTo(element,
    { scale: 1 },
    { scale: 1.1, duration: 0.3, yoyo: true, repeat: 2, ease: 'power2.inOut' }
  );
}

/** Animation de glow néon */
export function animateNeonGlow(element: HTMLElement, color: string = '#a855f7') {
  gsap.to(element, {
    boxShadow: `0 0 20px ${color}80, 0 0 40px ${color}40, 0 0 60px ${color}20`,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}
