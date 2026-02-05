/**
 * QQUIZ PRODIGY - Scoring System (Style QuizUp)
 * Système de points engageant avec progression lente
 * Max 20 points par question - Progression fluide et addictive
 */

export interface ScoreResult {
  basePoints: number;      // Points de base (5-10)
  timeBonus: number;       // Bonus temps (0-5)
  streakBonus: number;     // Bonus série (0-5)
  totalPoints: number;     // Total (max ~20)
  xpGained: number;        // XP gagné
  message: string;         // Message de feedback
  grade: 'perfect' | 'great' | 'good' | 'ok' | 'miss';
}

export interface GameSummary {
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  averageTime: number;
  bestStreak: number;
  xpEarned: number;
  coinsEarned: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  rankMessage: string;
}

// Configuration du scoring style QuizUp
const SCORING_CONFIG = {
  // Points de base selon la difficulté
  basePoints: {
    easy: 5,
    medium: 7,
    hard: 10
  },
  
  // Bonus temps (plus tu réponds vite, plus tu gagnes)
  // Temps en secondes restantes -> bonus
  timeBonus: {
    fast: { threshold: 10, bonus: 5 },      // 10+ secondes restantes
    good: { threshold: 7, bonus: 3 },       // 7-9 secondes
    ok: { threshold: 4, bonus: 1 },         // 4-6 secondes
    slow: { threshold: 0, bonus: 0 }        // 0-3 secondes
  },
  
  // Bonus série (combo)
  streakBonus: {
    3: 1,   // 3 bonnes réponses d'affilée
    5: 2,   // 5 bonnes réponses
    7: 3,   // 7 bonnes réponses
    10: 5   // 10 bonnes réponses (série parfaite)
  },
  
  // XP par action
  xp: {
    correctAnswer: 10,
    perfectAnswer: 15,  // Réponse rapide et correcte
    winGame: 50,
    perfectGame: 100,   // 100% de bonnes réponses
    streak5: 20,
    streak10: 50
  },
  
  // Coins (monnaie virtuelle)
  coins: {
    correctAnswer: 1,
    winGame: 10,
    perfectGame: 25
  }
};

/**
 * Calcule le score pour une réponse
 */
export function calculateAnswerScore(
  isCorrect: boolean,
  difficulty: 'easy' | 'medium' | 'hard',
  timeRemaining: number,
  currentStreak: number
): ScoreResult {
  if (!isCorrect) {
    return {
      basePoints: 0,
      timeBonus: 0,
      streakBonus: 0,
      totalPoints: 0,
      xpGained: 0,
      message: 'Raté !',
      grade: 'miss'
    };
  }

  // Points de base
  const basePoints = SCORING_CONFIG.basePoints[difficulty];
  
  // Bonus temps
  let timeBonus = 0;
  let grade: ScoreResult['grade'] = 'ok';
  
  if (timeRemaining >= SCORING_CONFIG.timeBonus.fast.threshold) {
    timeBonus = SCORING_CONFIG.timeBonus.fast.bonus;
    grade = 'perfect';
  } else if (timeRemaining >= SCORING_CONFIG.timeBonus.good.threshold) {
    timeBonus = SCORING_CONFIG.timeBonus.good.bonus;
    grade = 'great';
  } else if (timeRemaining >= SCORING_CONFIG.timeBonus.ok.threshold) {
    timeBonus = SCORING_CONFIG.timeBonus.ok.bonus;
    grade = 'good';
  }
  
  // Bonus série
  let streakBonus = 0;
  if (currentStreak >= 10) streakBonus = SCORING_CONFIG.streakBonus[10];
  else if (currentStreak >= 7) streakBonus = SCORING_CONFIG.streakBonus[7];
  else if (currentStreak >= 5) streakBonus = SCORING_CONFIG.streakBonus[5];
  else if (currentStreak >= 3) streakBonus = SCORING_CONFIG.streakBonus[3];
  
  const totalPoints = basePoints + timeBonus + streakBonus;
  
  // XP gagné
  let xpGained = SCORING_CONFIG.xp.correctAnswer;
  if (grade === 'perfect') xpGained = SCORING_CONFIG.xp.perfectAnswer;
  if (currentStreak === 5) xpGained += SCORING_CONFIG.xp.streak5;
  if (currentStreak === 10) xpGained += SCORING_CONFIG.xp.streak10;
  
  // Message de feedback
  const messages = {
    perfect: ['Parfait ! 🔥', 'Incroyable ! ⚡', 'Légendaire ! 👑'],
    great: ['Excellent ! ✨', 'Super ! 🌟', 'Bien joué ! 💪'],
    good: ['Correct ! ✓', 'Bien ! 👍', 'Continue ! 🎯'],
    ok: ['Juste à temps ! ⏱️', 'De justesse ! 😅', 'Ouf ! 😮‍💨']
  };
  
  const messageArray = messages[grade] || messages.ok;
  const message = messageArray[Math.floor(Math.random() * messageArray.length)];
  
  return {
    basePoints,
    timeBonus,
    streakBonus,
    totalPoints,
    xpGained,
    message,
    grade
  };
}

/**
 * Calcule le résumé de fin de partie
 */
export function calculateGameSummary(
  scores: ScoreResult[],
  totalQuestions: number,
  totalTimeSpent: number
): GameSummary {
  const correctAnswers = scores.filter(s => s.totalPoints > 0).length;
  const totalScore = scores.reduce((sum, s) => sum + s.totalPoints, 0);
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const averageTime = Math.round(totalTimeSpent / totalQuestions);
  
  // Meilleure série
  let bestStreak = 0;
  let currentStreak = 0;
  scores.forEach(s => {
    if (s.totalPoints > 0) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  // XP total
  let xpEarned = scores.reduce((sum, s) => sum + s.xpGained, 0);
  const isWin = correctAnswers >= totalQuestions / 2;
  const isPerfect = correctAnswers === totalQuestions;
  
  if (isPerfect) xpEarned += SCORING_CONFIG.xp.perfectGame;
  else if (isWin) xpEarned += SCORING_CONFIG.xp.winGame;
  
  // Coins
  let coinsEarned = scores.filter(s => s.totalPoints > 0).length * SCORING_CONFIG.coins.correctAnswer;
  if (isPerfect) coinsEarned += SCORING_CONFIG.coins.perfectGame;
  else if (isWin) coinsEarned += SCORING_CONFIG.coins.winGame;
  
  // Rang
  let rank: GameSummary['rank'];
  let rankMessage: string;
  
  if (accuracy >= 100) {
    rank = 'S';
    rankMessage = 'LÉGENDAIRE ! 👑';
  } else if (accuracy >= 80) {
    rank = 'A';
    rankMessage = 'EXCELLENT ! 🌟';
  } else if (accuracy >= 60) {
    rank = 'B';
    rankMessage = 'BIEN JOUÉ ! 💪';
  } else if (accuracy >= 40) {
    rank = 'C';
    rankMessage = 'PAS MAL ! 👍';
  } else {
    rank = 'D';
    rankMessage = 'CONTINUE ! 🎯';
  }
  
  return {
    totalScore,
    correctAnswers,
    totalQuestions,
    accuracy,
    averageTime,
    bestStreak,
    xpEarned,
    coinsEarned,
    rank,
    rankMessage
  };
}

/**
 * Calcule le niveau à partir de l'XP total
 * Progression lente et engageante
 */
export function calculateLevel(totalXp: number): { level: number; currentXp: number; xpToNext: number; progress: number } {
  // Formule: XP nécessaire = niveau * 100
  // Niveau 1: 100 XP, Niveau 2: 200 XP, etc.
  let level = 1;
  let xpUsed = 0;
  
  while (totalXp >= xpUsed + (level * 100)) {
    xpUsed += level * 100;
    level++;
  }
  
  const currentXp = totalXp - xpUsed;
  const xpToNext = level * 100;
  const progress = Math.round((currentXp / xpToNext) * 100);
  
  return { level, currentXp, xpToNext, progress };
}

/**
 * Calcule la ligue à partir des points de ligue
 */
export function calculateLeague(leaguePoints: number): {
  league: string;
  leagueName: string;
  nextLeague: string | null;
  pointsToNext: number;
  progress: number;
} {
  const leagues = [
    { id: 'bronze', name: 'Bronze', minPoints: 0 },
    { id: 'silver', name: 'Argent', minPoints: 500 },
    { id: 'gold', name: 'Or', minPoints: 1500 },
    { id: 'platinum', name: 'Platine', minPoints: 3000 },
    { id: 'diamond', name: 'Diamant', minPoints: 5000 },
    { id: 'legend', name: 'Légende', minPoints: 10000 }
  ];
  
  let currentLeague = leagues[0];
  let nextLeague = leagues[1];
  
  for (let i = 0; i < leagues.length; i++) {
    if (leaguePoints >= leagues[i].minPoints) {
      currentLeague = leagues[i];
      nextLeague = leagues[i + 1] || null;
    }
  }
  
  const pointsToNext = nextLeague ? nextLeague.minPoints - leaguePoints : 0;
  const progress = nextLeague 
    ? Math.round(((leaguePoints - currentLeague.minPoints) / (nextLeague.minPoints - currentLeague.minPoints)) * 100)
    : 100;
  
  return {
    league: currentLeague.id,
    leagueName: currentLeague.name,
    nextLeague: nextLeague?.name || null,
    pointsToNext,
    progress
  };
}

/**
 * Formatte le score pour l'affichage
 */
export function formatScore(score: number): string {
  return score.toString();
}

/**
 * Formatte l'XP pour l'affichage
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}
