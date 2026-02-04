import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LoginRequest {
  email: string;
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
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: email.split('@')[0],
      level: 1,
      coins: 100,
      gems: 10,
      createdAt: new Date().toISOString()
    };

    const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString('base64');

    return res.status(200).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
