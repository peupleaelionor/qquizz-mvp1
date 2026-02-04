import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, username, password } = req.body as RegisterRequest;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      level: 1,
      xp: 0,
      coins: 100,
      gems: 10,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      stats: {
        totalGames: 0,
        wins: 0,
        losses: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        streak: 0,
        bestStreak: 0
      },
      createdAt: new Date().toISOString()
    };

    const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString('base64');

    return res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
