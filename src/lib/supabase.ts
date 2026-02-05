import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://qkiksxuflgbwpqowdmue.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFraWtzeHVmbGdid3Bxb3dkbXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE4NDEwNiwiZXhwIjoyMDg1NzYwMTA2fQ.s-_G3O4c_Lgu0FkvDZAsJoZ7EWxAi9qevqVvx_wOaIg';

// Client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  avatar_color?: string;
  xp: number;
  level: number;
  league: string;
  league_points: number;
  total_games: number;
  wins: number;
  losses: number;
  total_questions: number;
  correct_answers: number;
  best_streak: number;
  total_time_played: number;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  player1_id: string;
  player2_id?: string;
  category: string;
  mode: 'solo' | 'friend' | 'random' | 'ranked';
  status: 'waiting' | 'playing' | 'finished';
  player1_score: number;
  player2_score: number;
  current_question: number;
  questions: any[];
  winner_id?: string;
  created_at: string;
  finished_at?: string;
}

export interface MatchmakingQueue {
  id: string;
  user_id: string;
  category?: string;
  mode: 'random' | 'ranked';
  rating: number;
  created_at: string;
}

// Fonctions d'authentification
export const authService = {
  // Inscription par email
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    
    if (error) throw error;
    
    // Créer le profil utilisateur
    if (data.user) {
      await this.createProfile(data.user.id, username);
    }
    
    return data;
  },
  
  // Connexion par email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  // Connexion Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Créer un profil utilisateur
  async createProfile(userId: string, username: string) {
    const colors = ['from-cyan-500 to-blue-600', 'from-purple-500 to-pink-600', 'from-green-500 to-emerald-600', 'from-orange-500 to-red-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      username,
      avatar_color: randomColor,
      xp: 0,
      level: 1,
      league: 'bronze',
      league_points: 0,
      total_games: 0,
      wins: 0,
      losses: 0,
      total_questions: 0,
      correct_answers: 0,
      best_streak: 0,
      total_time_played: 0
    });
    
    if (error) throw error;
  },
  
  // Obtenir le profil
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return data;
  },
  
  // Mettre à jour le profil
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
  }
};

// Fonctions de jeu
export const gameService = {
  // Créer une partie solo
  async createSoloGame(userId: string, category: string, questions: any[]) {
    const { data, error } = await supabase.from('games').insert({
      player1_id: userId,
      category,
      mode: 'solo',
      status: 'playing',
      player1_score: 0,
      current_question: 0,
      questions
    }).select().single();
    
    if (error) throw error;
    return data;
  },
  
  // Mettre à jour le score
  async updateGameScore(gameId: string, playerId: string, score: number, currentQuestion: number) {
    const isPlayer1 = true; // À déterminer selon le contexte
    
    const { error } = await supabase.from('games').update({
      [isPlayer1 ? 'player1_score' : 'player2_score']: score,
      current_question: currentQuestion
    }).eq('id', gameId);
    
    if (error) throw error;
  },
  
  // Terminer une partie
  async finishGame(gameId: string, winnerId?: string) {
    const { error } = await supabase.from('games').update({
      status: 'finished',
      winner_id: winnerId,
      finished_at: new Date().toISOString()
    }).eq('id', gameId);
    
    if (error) throw error;
  },
  
  // Obtenir l'historique des parties
  async getGameHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .eq('status', 'finished')
      .order('finished_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// Fonctions de matchmaking temps réel
export const matchmakingService = {
  // Rejoindre la file d'attente
  async joinQueue(userId: string, mode: 'random' | 'ranked', category?: string, rating: number = 1000) {
    const { data, error } = await supabase.from('matchmaking_queue').insert({
      user_id: userId,
      mode,
      category,
      rating
    }).select().single();
    
    if (error) throw error;
    return data;
  },
  
  // Quitter la file d'attente
  async leaveQueue(userId: string) {
    const { error } = await supabase
      .from('matchmaking_queue')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },
  
  // Chercher un adversaire
  async findOpponent(userId: string, mode: 'random' | 'ranked', rating: number = 1000) {
    // Chercher un joueur avec un rating similaire (±200)
    const { data, error } = await supabase
      .from('matchmaking_queue')
      .select('*')
      .eq('mode', mode)
      .neq('user_id', userId)
      .gte('rating', rating - 200)
      .lte('rating', rating + 200)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (error) return null;
    return data;
  },
  
  // S'abonner aux changements de la file d'attente (temps réel)
  subscribeToQueue(callback: (payload: any) => void) {
    return supabase
      .channel('matchmaking_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matchmaking_queue' }, callback)
      .subscribe();
  },
  
  // S'abonner aux changements d'une partie (temps réel)
  subscribeToGame(gameId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`game_${gameId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, callback)
      .subscribe();
  }
};

// Fonctions de classement
export const leaderboardService = {
  // Obtenir le classement mondial
  async getGlobalLeaderboard(limit: number = 100) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, avatar_color, xp, level, league, league_points, wins, country')
      .order('league_points', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },
  
  // Obtenir le classement par ligue
  async getLeagueLeaderboard(league: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, avatar_color, xp, level, league, league_points, wins, country')
      .eq('league', league)
      .order('league_points', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },
  
  // Obtenir le rang d'un joueur
  async getPlayerRank(userId: string) {
    const { data, error } = await supabase
      .rpc('get_player_rank', { player_id: userId });
    
    if (error) return null;
    return data;
  }
};

// Export par défaut
export default supabase;
