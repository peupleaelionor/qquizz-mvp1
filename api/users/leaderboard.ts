import type { VercelRequest, VercelResponse } from '@vercel/node';

const mockLeaderboard = [
  {
    rank: 1,
    userId: 'user1',
    username: 'ProGamer243',
    level: 45,
    xp: 12500,
    totalScore: 98750,
    wins: 342,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer243',
    country: 'CD',
    badges: ['🏆', '⚡', '🔥']
  },
  {
    rank: 2,
    userId: 'user2',
    username: 'QuizMaster_RDC',
    level: 42,
    xp: 11200,
    totalScore: 94320,
    wins: 318,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuizMaster_RDC',
    country: 'CD',
    badges: ['🏆', '⚡']
  },
  {
    rank: 3,
    username: 'BrainStorm_243',
    userId: 'user3',
    level: 40,
    xp: 10800,
    totalScore: 91200,
    wins: 295,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BrainStorm_243',
    country: 'CD',
    badges: ['🏆', '🎯']
  },
  {
    rank: 4,
    userId: 'user4',
    username: 'KinshasaKing',
    level: 38,
    xp: 9950,
    totalScore: 87400,
    wins: 276,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KinshasaKing',
    country: 'CD',
    badges: ['⚡', '🔥']
  },
  {
    rank: 5,
    userId: 'user5',
    username: 'AfricanGenius',
    level: 36,
    xp: 9200,
    totalScore: 83100,
    wins: 254,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AfricanGenius',
    country: 'SN',
    badges: ['🎯', '🔥']
  },
  {
    rank: 6,
    userId: 'user6',
    username: 'QuizNinja_CG',
    level: 35,
    xp: 8800,
    totalScore: 79800,
    wins: 241,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuizNinja_CG',
    country: 'CG',
    badges: ['⚡']
  },
  {
    rank: 7,
    userId: 'user7',
    username: 'Lumumbist',
    level: 33,
    xp: 8300,
    totalScore: 75600,
    wins: 228,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lumumbist',
    country: 'CD',
    badges: ['🔥']
  },
  {
    rank: 8,
    userId: 'user8',
    username: 'CultureVulture',
    level: 32,
    xp: 7950,
    totalScore: 72400,
    wins: 215,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CultureVulture',
    country: 'CI',
    badges: ['🎯']
  },
  {
    rank: 9,
    userId: 'user9',
    username: 'HistoryBuff243',
    level: 30,
    xp: 7500,
    totalScore: 68900,
    wins: 202,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HistoryBuff243',
    country: 'CD',
    badges: []
  },
  {
    rank: 10,
    userId: 'user10',
    username: 'SmartPlayer_DRC',
    level: 29,
    xp: 7200,
    totalScore: 65800,
    wins: 189,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SmartPlayer_DRC',
    country: 'CD',
    badges: []
  }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = '10', country } = req.query;

    let leaderboard = [...mockLeaderboard];

    if (country && typeof country === 'string') {
      leaderboard = leaderboard.filter(user => user.country === country.toUpperCase());
    }

    const limitNum = parseInt(limit as string, 10);
    leaderboard = leaderboard.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      leaderboard,
      total: leaderboard.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
