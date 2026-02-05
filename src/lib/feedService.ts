import { supabase } from './supabase';

// Types
export interface Post {
  id: string;
  user_id: string;
  type: 'result' | 'challenge' | 'achievement' | 'level_up' | 'league_up' | 'streak' | 'status';
  content?: string;
  category?: string;
  score?: number;
  opponent_id?: string;
  opponent_score?: number;
  is_victory?: boolean;
  achievement_id?: string;
  new_level?: number;
  new_league?: string;
  streak_count?: number;
  challenge_category?: string;
  challenge_difficulty?: string;
  challenge_expires_at?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_public: boolean;
  created_at: string;
  // Relations
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
    avatar_color?: string;
    level: number;
    league: string;
  };
  opponent?: {
    id: string;
    username: string;
    avatar_url?: string;
    avatar_color?: string;
  };
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
    avatar_color?: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  from_user_id?: string;
  post_id?: string;
  content?: string;
  is_read: boolean;
  created_at: string;
  from_user?: {
    id: string;
    username: string;
    avatar_url?: string;
    avatar_color?: string;
  };
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id?: string;
  category: string;
  difficulty: string;
  status: 'pending' | 'accepted' | 'completed' | 'expired' | 'declined';
  challenger_score?: number;
  challenged_score?: number;
  winner_id?: string;
  expires_at: string;
  created_at: string;
  challenger?: {
    id: string;
    username: string;
    avatar_url?: string;
    avatar_color?: string;
    level: number;
  };
}

// Service Feed
export const feedService = {
  // Obtenir le fil d'actualité
  async getFeed(limit: number = 20, offset: number = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles!posts_user_id_fkey(id, username, avatar_url, avatar_color, level, league),
        opponent:profiles!posts_opponent_id_fkey(id, username, avatar_url, avatar_color)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // Obtenir le feed d'un utilisateur spécifique
  async getUserFeed(userId: string, limit: number = 20): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles!posts_user_id_fkey(id, username, avatar_url, avatar_color, level, league),
        opponent:profiles!posts_opponent_id_fkey(id, username, avatar_url, avatar_color)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Créer un post de résultat de quiz
  async postQuizResult(
    userId: string,
    category: string,
    score: number,
    isVictory: boolean,
    opponentId?: string,
    opponentScore?: number
  ): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        type: 'result',
        category,
        score,
        is_victory: isVictory,
        opponent_id: opponentId,
        opponent_score: opponentScore
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un post d'achievement
  async postAchievement(userId: string, achievementId: string): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        type: 'achievement',
        achievement_id: achievementId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un post de level up
  async postLevelUp(userId: string, newLevel: number): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        type: 'level_up',
        new_level: newLevel
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un post de promotion de ligue
  async postLeagueUp(userId: string, newLeague: string): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        type: 'league_up',
        new_league: newLeague
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un défi public
  async createChallenge(
    challengerId: string,
    category: string,
    difficulty: string = 'medium',
    challengedId?: string
  ): Promise<Challenge> {
    const { data, error } = await supabase
      .from('challenges')
      .insert({
        challenger_id: challengerId,
        challenged_id: challengedId,
        category,
        difficulty
      })
      .select()
      .single();

    if (error) throw error;

    // Créer aussi un post pour le défi
    await supabase.from('posts').insert({
      user_id: challengerId,
      type: 'challenge',
      challenge_category: category,
      challenge_difficulty: difficulty
    });

    return data;
  },

  // Liker un post
  async likePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });

    if (error && !error.message.includes('duplicate')) throw error;
  },

  // Unliker un post
  async unlikePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Vérifier si un post est liké
  async isPostLiked(postId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    return !!data;
  },

  // Obtenir les commentaires d'un post
  async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        user:profiles(id, username, avatar_url, avatar_color)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Ajouter un commentaire
  async addComment(postId: string, userId: string, content: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: userId, content })
      .select(`
        *,
        user:profiles(id, username, avatar_url, avatar_color)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un commentaire
  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }
};

// Service Notifications
export const notificationService = {
  // Obtenir les notifications
  async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        from_user:profiles!notifications_from_user_id_fkey(id, username, avatar_url, avatar_color)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  // S'abonner aux notifications en temps réel
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new as Notification)
      )
      .subscribe();
  }
};

// Service Challenges
export const challengeService = {
  // Obtenir les défis publics
  async getPublicChallenges(limit: number = 20): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        challenger:profiles!challenges_challenger_id_fkey(id, username, avatar_url, avatar_color, level)
      `)
      .is('challenged_id', null)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Accepter un défi
  async acceptChallenge(challengeId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('challenges')
      .update({ challenged_id: userId, status: 'accepted' })
      .eq('id', challengeId)
      .is('challenged_id', null);

    if (error) throw error;
  },

  // Compléter un défi
  async completeChallenge(
    challengeId: string,
    challengerScore: number,
    challengedScore: number
  ): Promise<void> {
    const winnerId = challengerScore > challengedScore ? 'challenger_id' : 'challenged_id';
    
    const { data: challenge } = await supabase
      .from('challenges')
      .select('challenger_id, challenged_id')
      .eq('id', challengeId)
      .single();

    if (!challenge) return;

    const { error } = await supabase
      .from('challenges')
      .update({
        status: 'completed',
        challenger_score: challengerScore,
        challenged_score: challengedScore,
        winner_id: challengerScore > challengedScore ? challenge.challenger_id : challenge.challenged_id,
        completed_at: new Date().toISOString()
      })
      .eq('id', challengeId);

    if (error) throw error;
  },

  // Obtenir mes défis
  async getMyChallenges(userId: string): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        challenger:profiles!challenges_challenger_id_fkey(id, username, avatar_url, avatar_color, level)
      `)
      .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

export default feedService;
