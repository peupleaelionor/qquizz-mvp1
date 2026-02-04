import type { VercelRequest, VercelResponse} from '@vercel/node';

interface SubmitScoreRequest {
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  category?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, score, correctAnswers, totalQuestions, timeSpent, category } = req.body as SubmitScoreRequest;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'User ID and score are required' });
    }

    const accuracy = (correctAnswers / totalQuestions) * 100;
    const xpGained = score + Math.floor(accuracy * 2);
    const coinsEarned = Math.floor(score / 10);

    const bonuses = [];
    if (accuracy === 100) {
      bonuses.push({ type: 'perfect', amount: 50, label: 'Score Parfait!' });
    }
    if (timeSpent < 60) {
      bonuses.push({ type: 'speed', amount: 25, label: 'Vitesse Éclair!' });
    }

    const totalCoins = coinsEarned + bonuses.reduce((sum, b) => sum + b.amount, 0);

    const result = {
      success: true,
      result: {
        score,
        accuracy: Math.round(accuracy),
        xpGained,
        coinsEarned: totalCoins,
        bonuses,
        newLevel: Math.floor(xpGained / 100) + 1,
        rank: Math.floor(Math.random() * 100) + 1,
        timestamp: new Date().toISOString()
      }
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Submit score error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
