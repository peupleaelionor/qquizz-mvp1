// QQUIZ PRODIGY - Système Utilisateur Complet
// Gestion XP, Niveaux, Stats, Achievements, Progression

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  avatarColor: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  league: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legend';
  leaguePoints: number;
  stats: UserStats;
  achievements: Achievement[];
  createdAt: string;
  lastPlayedAt: string;
}

export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  bestStreak: number;
  currentStreak: number;
  totalPlayTime: number;
  favoriteCategory: string;
  categoryStats: Record<string, CategoryStat>;
}

export interface CategoryStat {
  played: number;
  correct: number;
  accuracy: number;
  bestScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface GameResult {
  category: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  isWin: boolean;
  isDuel: boolean;
  opponentName?: string;
  opponentScore?: number;
}

// Calcul XP nécessaire pour chaque niveau
export const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calcul du niveau basé sur l'XP total
export const calculateLevelFromXp = (totalXp: number): { level: number; currentXp: number; xpToNext: number } => {
  let level = 1;
  let xpNeeded = calculateXpForLevel(level);
  let remainingXp = totalXp;

  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    level++;
    xpNeeded = calculateXpForLevel(level);
  }

  return {
    level,
    currentXp: remainingXp,
    xpToNext: xpNeeded
  };
};

// Calcul de la ligue basée sur les points
export const calculateLeague = (points: number): UserProfile['league'] => {
  if (points >= 10000) return 'legend';
  if (points >= 5000) return 'diamond';
  if (points >= 2500) return 'platinum';
  if (points >= 1000) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
};

// Définition des achievements
export const ACHIEVEMENTS_CONFIG: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_victory',
    name: 'Première Victoire',
    description: 'Gagne ta première partie',
    image: '/images/achievements/Achiev_Premiere_Victoire.png',
    target: 1
  },
  {
    id: '10_victories',
    name: '10 Victoires',
    description: 'Gagne 10 parties',
    image: '/images/achievements/Achiev_10_Victoires.png',
    target: 10
  },
  {
    id: '100_questions',
    name: '100 Questions',
    description: 'Réponds à 100 questions',
    image: '/images/achievements/Achiev_100_Questions.png',
    target: 100
  },
  {
    id: 'perfect_series',
    name: 'Série Parfaite',
    description: '10 bonnes réponses consécutives',
    image: '/images/achievements/Achiev_Serie_Parfaite.png',
    target: 10
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Atteins 90% de précision sur 50 questions',
    image: '/images/achievements/Achiev_Premiere_Victoire.png',
    target: 50
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Réponds en moins de 3 secondes 20 fois',
    image: '/images/achievements/Achiev_10_Victoires.png',
    target: 20
  },
  {
    id: 'category_expert',
    name: 'Expert Catégorie',
    description: 'Atteins 100% sur une catégorie (10 questions)',
    image: '/images/achievements/Achiev_100_Questions.png',
    target: 1
  },
  {
    id: 'social_butterfly',
    name: 'Papillon Social',
    description: 'Joue 5 duels contre des amis',
    image: '/images/achievements/Achiev_Serie_Parfaite.png',
    target: 5
  }
];

// Avatars disponibles
export const AVATARS = [
  { id: 'PM', name: 'Prodigy Master' },
  { id: 'QK', name: 'Quiz King' },
  { id: 'BS', name: 'Brain Storm' },
  { id: 'QN', name: 'Quiz Ninja' },
  { id: 'MR', name: 'Mind Reader' },
  { id: 'GN', name: 'Genius' },
  { id: 'WZ', name: 'Wizard' },
  { id: 'CH', name: 'Champion' }
];

export const AVATAR_COLORS = [
  'from-violet-600 to-fuchsia-600',
  'from-cyan-500 to-blue-600',
  'from-green-500 to-emerald-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-purple-600',
  'from-yellow-500 to-amber-600',
  'from-teal-500 to-cyan-600'
];

// Créer un nouvel utilisateur
export const createNewUser = (username: string): UserProfile => {
  const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const achievements: Achievement[] = ACHIEVEMENTS_CONFIG.map(a => ({
    ...a,
    unlocked: false,
    progress: 0
  }));

  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    avatar: randomAvatar.id,
    avatarColor: randomColor,
    level: 1,
    xp: 0,
    xpToNextLevel: calculateXpForLevel(1),
    totalXp: 0,
    league: 'bronze',
    leaguePoints: 0,
    stats: {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      bestStreak: 0,
      currentStreak: 0,
      totalPlayTime: 0,
      favoriteCategory: '',
      categoryStats: {}
    },
    achievements,
    createdAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString()
  };
};

// Sauvegarder l'utilisateur dans localStorage
export const saveUser = (user: UserProfile): void => {
  localStorage.setItem('qquiz_user', JSON.stringify(user));
};

// Charger l'utilisateur depuis localStorage
export const loadUser = (): UserProfile | null => {
  const data = localStorage.getItem('qquiz_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Mettre à jour les stats après une partie
export const updateUserAfterGame = (user: UserProfile, result: GameResult): UserProfile => {
  const updatedUser = { ...user };
  const stats = { ...updatedUser.stats };

  stats.totalGames++;
  stats.totalQuestions += result.totalQuestions;
  stats.correctAnswers += result.correctAnswers;
  stats.accuracy = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  stats.totalPlayTime += result.timeSpent;

  if (result.isWin) {
    stats.wins++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.losses++;
    stats.currentStreak = 0;
  }

  stats.winRate = Math.round((stats.wins / stats.totalGames) * 100);

  if (!stats.categoryStats[result.category]) {
    stats.categoryStats[result.category] = {
      played: 0,
      correct: 0,
      accuracy: 0,
      bestScore: 0
    };
  }
  
  const catStat = stats.categoryStats[result.category];
  catStat.played += result.totalQuestions;
  catStat.correct += result.correctAnswers;
  catStat.accuracy = Math.round((catStat.correct / catStat.played) * 100);
  if (result.score > catStat.bestScore) {
    catStat.bestScore = result.score;
  }

  let maxPlayed = 0;
  Object.entries(stats.categoryStats).forEach(([cat, stat]) => {
    if (stat.played > maxPlayed) {
      maxPlayed = stat.played;
      stats.favoriteCategory = cat;
    }
  });

  updatedUser.stats = stats;

  const baseXp = result.score / 10;
  const bonusXp = result.isWin ? 50 : 10;
  const streakBonus = Math.min(stats.currentStreak * 5, 50);
  const totalXpGained = Math.floor(baseXp + bonusXp + streakBonus);

  updatedUser.totalXp += totalXpGained;
  
  const levelInfo = calculateLevelFromXp(updatedUser.totalXp);
  updatedUser.level = levelInfo.level;
  updatedUser.xp = levelInfo.currentXp;
  updatedUser.xpToNextLevel = levelInfo.xpToNext;

  const leaguePointsGained = result.isWin ? 25 : (result.isDuel ? -10 : 5);
  updatedUser.leaguePoints = Math.max(0, updatedUser.leaguePoints + leaguePointsGained);
  updatedUser.league = calculateLeague(updatedUser.leaguePoints);

  updatedUser.achievements = checkAchievements(updatedUser, result);
  updatedUser.lastPlayedAt = new Date().toISOString();

  return updatedUser;
};

const checkAchievements = (user: UserProfile, result: GameResult): Achievement[] => {
  return user.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let newProgress = achievement.progress;

    switch (achievement.id) {
      case 'first_victory':
        if (result.isWin) newProgress = 1;
        break;
      case '10_victories':
        if (result.isWin) newProgress = user.stats.wins;
        break;
      case '100_questions':
        newProgress = user.stats.totalQuestions;
        break;
      case 'perfect_series':
        if (result.correctAnswers === result.totalQuestions) {
          newProgress = Math.max(newProgress, result.totalQuestions);
        }
        break;
      case 'quiz_master':
        if (user.stats.accuracy >= 90 && user.stats.totalQuestions >= 50) {
          newProgress = 50;
        }
        break;
      case 'category_expert':
        if (result.correctAnswers === result.totalQuestions && result.totalQuestions >= 10) {
          newProgress = 1;
        }
        break;
    }

    const unlocked = newProgress >= achievement.target;

    return {
      ...achievement,
      progress: newProgress,
      unlocked,
      unlockedAt: unlocked && !achievement.unlocked ? new Date().toISOString() : achievement.unlockedAt
    };
  });
};

export const getLeagueBadge = (league: UserProfile['league']): string => {
  const badges: Record<UserProfile['league'], string> = {
    bronze: '/images/badges/Badge_Bronze.png',
    silver: '/images/badges/Badge_Argent.png',
    gold: '/images/badges/Badge_Or.png',
    platinum: '/images/badges/Badge_Platine.png',
    diamond: '/images/badges/Badge_Diamant.png',
    legend: '/images/badges/Badge_Legende.png'
  };
  return badges[league];
};

export const getLeagueName = (league: UserProfile['league']): string => {
  const names: Record<UserProfile['league'], string> = {
    bronze: 'Bronze',
    silver: 'Argent',
    gold: 'Or',
    platinum: 'Platine',
    diamond: 'Diamant',
    legend: 'Légende'
  };
  return names[league];
};

export const formatPlayTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
