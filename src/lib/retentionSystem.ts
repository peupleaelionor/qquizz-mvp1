// ============================================
// QQUIZ PRODIGY - RETENTION SYSTEM
// Streaks, Daily Rewards, Daily Challenges
// Designed to maximize engagement & retention
// ============================================

export interface DailyReward {
  day: number;
  reward: string;
  xp: number;
  claimed: boolean;
  icon: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  icon: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayDate: string;
  totalDaysPlayed: number;
}

export interface RetentionData {
  streak: StreakData;
  dailyRewards: DailyReward[];
  dailyChallenges: DailyChallenge[];
  lastRewardClaim: string;
  weeklyProgress: number[];
}

const STORAGE_KEY = 'qquiz_retention';

// 7-day reward cycle (repeats)
const REWARD_CYCLE: Omit<DailyReward, 'claimed'>[] = [
  { day: 1, reward: '10 XP', xp: 10, icon: '⭐' },
  { day: 2, reward: '15 XP', xp: 15, icon: '🔥' },
  { day: 3, reward: '20 XP + Badge', xp: 20, icon: '🏅' },
  { day: 4, reward: '25 XP', xp: 25, icon: '💎' },
  { day: 5, reward: '30 XP + Titre', xp: 30, icon: '👑' },
  { day: 6, reward: '40 XP', xp: 40, icon: '🚀' },
  { day: 7, reward: '50 XP + Coffre', xp: 50, icon: '🎁' },
];

// Generate daily challenges based on date
function generateDailyChallenges(): DailyChallenge[] {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  const categories = ['rap', 'sport', 'manga', 'netflix', 'nba', 'afrique', 'kpop', 'football_africain', 'gaming', 'tiktok'];
  const catNames: Record<string, string> = {
    'rap': 'RAP', 'sport': 'Sport', 'manga': 'Manga', 'netflix': 'Netflix',
    'nba': 'NBA', 'afrique': 'Afrique', 'kpop': 'K-POP', 'football_africain': 'Football Africain',
    'gaming': 'Gaming', 'tiktok': 'TikTok'
  };

  const cat1 = categories[seed % categories.length];
  const cat2 = categories[(seed + 3) % categories.length];

  return [
    {
      id: `daily_1_${today}`,
      title: 'Quiz Express',
      description: 'Termine 3 parties de quiz',
      category: 'any',
      target: 3,
      progress: 0,
      xpReward: 15,
      completed: false,
      icon: '⚡'
    },
    {
      id: `daily_2_${today}`,
      title: `Expert ${catNames[cat1]}`,
      description: `Obtiens 80%+ en ${catNames[cat1]}`,
      category: cat1,
      target: 80,
      progress: 0,
      xpReward: 20,
      completed: false,
      icon: '🎯'
    },
    {
      id: `daily_3_${today}`,
      title: 'Combo Master',
      description: 'Fais un combo de 5 bonnes réponses',
      category: 'any',
      target: 5,
      progress: 0,
      xpReward: 25,
      completed: false,
      icon: '🔥'
    },
    {
      id: `daily_4_${today}`,
      title: `Défi ${catNames[cat2]}`,
      description: `Joue 2 parties en ${catNames[cat2]}`,
      category: cat2,
      target: 2,
      progress: 0,
      xpReward: 15,
      completed: false,
      icon: '🏆'
    },
  ];
}

// Get or initialize retention data
export function getRetentionData(): RetentionData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as RetentionData;
      
      // Check if daily challenges need refresh
      const today = new Date().toDateString();
      if (data.dailyChallenges.length === 0 || !data.dailyChallenges[0].id.includes(today)) {
        data.dailyChallenges = generateDailyChallenges();
      }
      
      return data;
    }
  } catch {}

  return {
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayDate: '',
      totalDaysPlayed: 0,
    },
    dailyRewards: REWARD_CYCLE.map(r => ({ ...r, claimed: false })),
    dailyChallenges: generateDailyChallenges(),
    lastRewardClaim: '',
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  };
}

function saveRetentionData(data: RetentionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Update streak on play
export function updateStreak(): RetentionData {
  const data = getRetentionData();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (data.streak.lastPlayDate === today) {
    return data; // Already played today
  }

  if (data.streak.lastPlayDate === yesterday) {
    data.streak.currentStreak += 1;
  } else if (data.streak.lastPlayDate !== today) {
    data.streak.currentStreak = 1; // Reset streak
  }

  data.streak.lastPlayDate = today;
  data.streak.totalDaysPlayed += 1;
  data.streak.longestStreak = Math.max(data.streak.longestStreak, data.streak.currentStreak);

  // Update weekly progress
  const dayOfWeek = new Date().getDay();
  data.weeklyProgress[dayOfWeek] = (data.weeklyProgress[dayOfWeek] || 0) + 1;

  saveRetentionData(data);
  return data;
}

// Claim daily reward
export function claimDailyReward(): { xp: number; day: number; icon: string } | null {
  const data = getRetentionData();
  const today = new Date().toDateString();

  if (data.lastRewardClaim === today) {
    return null; // Already claimed today
  }

  const dayIndex = (data.streak.currentStreak - 1) % 7;
  const reward = data.dailyRewards[dayIndex];
  
  if (reward) {
    data.dailyRewards[dayIndex].claimed = true;
    data.lastRewardClaim = today;
    saveRetentionData(data);
    return { xp: reward.xp, day: reward.day, icon: reward.icon };
  }

  return null;
}

// Check if daily reward is available
export function isDailyRewardAvailable(): boolean {
  const data = getRetentionData();
  return data.lastRewardClaim !== new Date().toDateString();
}

// Update daily challenge progress
export function updateChallengeProgress(
  challengeType: 'games_played' | 'accuracy' | 'combo' | 'category_games',
  value: number,
  category?: string
): DailyChallenge[] {
  const data = getRetentionData();

  data.dailyChallenges = data.dailyChallenges.map(challenge => {
    if (challenge.completed) return challenge;

    if (challengeType === 'games_played' && challenge.title === 'Quiz Express') {
      challenge.progress = Math.min(challenge.progress + 1, challenge.target);
    }
    if (challengeType === 'accuracy' && category && challenge.category === category && challenge.title.startsWith('Expert')) {
      challenge.progress = Math.max(challenge.progress, value);
    }
    if (challengeType === 'combo' && challenge.title === 'Combo Master') {
      challenge.progress = Math.max(challenge.progress, value);
    }
    if (challengeType === 'category_games' && category && challenge.category === category && challenge.title.startsWith('Défi')) {
      challenge.progress = Math.min(challenge.progress + 1, challenge.target);
    }

    if (challenge.progress >= challenge.target) {
      challenge.completed = true;
    }

    return challenge;
  });

  saveRetentionData(data);
  return data.dailyChallenges;
}

// Get streak multiplier for XP bonus
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 1.5;
  if (streak >= 14) return 1.3;
  if (streak >= 7) return 1.2;
  if (streak >= 3) return 1.1;
  return 1.0;
}

// Get time until next daily reset
export function getTimeUntilReset(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  return `${hours}h ${minutes}min`;
}
