-- QQUIZ PRODIGY - Schéma de base de données complet pour Supabase
-- Niveau Supérieur : Architecture complète pour surpasser QuizUp

-- ============================================================================
-- 1. UTILISATEURS & AUTHENTIFICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 100,
  gems INTEGER DEFAULT 10,
  country_code TEXT DEFAULT 'CD',
  language TEXT DEFAULT 'fr',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_games INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_time_played INTEGER DEFAULT 0,
  favorite_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. QUESTIONS & CATÉGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_ln TEXT,
  icon TEXT,
  color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  points INTEGER DEFAULT 10,
  explanation TEXT,
  image_url TEXT,
  video_url TEXT,
  language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT TRUE,
  times_answered INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. PARTIES & SCORES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT CHECK (game_type IN ('solo', 'duel', 'tournament', 'practice')) DEFAULT 'solo',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')) DEFAULT 'waiting',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  rank INTEGER,
  is_winner BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  UNIQUE(game_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.game_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. SYSTÈME SOCIAL - AMIS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- ============================================================================
-- 5. SYSTÈME DE CHAT & MESSAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('direct', 'group', 'global')) DEFAULT 'direct',
  name TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'game_invite')) DEFAULT 'text',
  media_url TEXT,
  metadata JSONB,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- ============================================================================
-- 6. PARTAGE DE CONTENU (IMAGES, VIDÉOS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  upload_status TEXT CHECK (upload_status IN ('pending', 'completed', 'failed')) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('friend_request', 'game_invite', 'message', 'achievement', 'reward', 'system')) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. LEADERBOARD & CLASSEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  leaderboard_type TEXT CHECK (leaderboard_type IN ('global', 'weekly', 'monthly', 'category')) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  score INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, leaderboard_type, category_id, period_start)
);

-- ============================================================================
-- 9. SYSTÈME DE RÉCOMPENSES & ACHIEVEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  coins_reward INTEGER DEFAULT 0,
  gems_reward INTEGER DEFAULT 0,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.daily_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reward_date DATE NOT NULL,
  coins_earned INTEGER DEFAULT 0,
  gems_earned INTEGER DEFAULT 0,
  streak_day INTEGER DEFAULT 1,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reward_date)
);

-- ============================================================================
-- 10. ÉCONOMIE VIRTUELLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  transaction_type TEXT CHECK (transaction_type IN ('earn', 'spend', 'purchase', 'reward', 'refund')) NOT NULL,
  currency TEXT CHECK (currency IN ('coins', 'gems')) NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT CHECK (item_type IN ('avatar', 'theme', 'power_up', 'badge', 'title')) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_coins INTEGER,
  price_gems INTEGER,
  is_premium_only BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.shop_items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  is_equipped BOOLEAN DEFAULT FALSE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- ============================================================================
-- INDEXES POUR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_level ON public.users(level DESC);

CREATE INDEX idx_questions_category ON public.questions(category_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_active ON public.questions(is_active);

CREATE INDEX idx_games_status ON public.games(status);
CREATE INDEX idx_games_type ON public.games(game_type);
CREATE INDEX idx_games_created ON public.games(created_at DESC);

CREATE INDEX idx_game_participants_user ON public.game_participants(user_id);
CREATE INDEX idx_game_participants_game ON public.game_participants(game_id);

CREATE INDEX idx_friendships_user ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend ON public.friendships(friend_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

CREATE INDEX idx_leaderboard_type ON public.leaderboard_entries(leaderboard_type);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard_entries(rank);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent voir leurs propres messages
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (
    sender_id = auth.uid() OR
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Politique : Les utilisateurs peuvent envoyer des messages
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Politique : Les utilisateurs peuvent voir leurs notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour messages
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONNÉES INITIALES
-- ============================================================================

-- Catégories de base
INSERT INTO public.categories (name, name_fr, name_ln, icon, color) VALUES
  ('geography', 'Géographie', 'Mokili', '🌍', '#10B981'),
  ('history', 'Histoire', 'Lisolo ya Kala', '📚', '#3B82F6'),
  ('literature', 'Littérature', 'Mikanda', '📖', '#8B5CF6'),
  ('music', 'Musique', 'Miziki', '🎵', '#EC4899'),
  ('sports', 'Sports', 'Masano', '⚽', '#F59E0B'),
  ('science', 'Sciences', 'Mayele', '🔬', '#06B6D4'),
  ('culture', 'Culture', 'Mimeseno', '🎭', '#EF4444'),
  ('economy', 'Économie', 'Mbongo', '💰', '#14B8A6')
ON CONFLICT (name) DO NOTHING;

-- Achievements de base
INSERT INTO public.achievements (code, name, description, icon, category, points, coins_reward, gems_reward, rarity) VALUES
  ('first_game', 'Premier Pas', 'Jouer votre première partie', '🎮', 'beginner', 10, 50, 5, 'common'),
  ('win_10', 'Gagnant', 'Remporter 10 parties', '🏆', 'wins', 50, 200, 20, 'rare'),
  ('perfect_score', 'Perfection', 'Obtenir un score parfait', '⭐', 'skill', 100, 500, 50, 'epic'),
  ('streak_7', 'Série Gagnante', 'Gagner 7 jours consécutifs', '🔥', 'streak', 200, 1000, 100, 'legendary'),
  ('friend_10', 'Populaire', 'Avoir 10 amis', '👥', 'social', 30, 100, 10, 'common')
ON CONFLICT (code) DO NOTHING;
