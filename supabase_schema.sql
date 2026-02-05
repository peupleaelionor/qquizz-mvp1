-- =====================================================
-- QQUIZ PRODIGY - Schema Supabase
-- =====================================================

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  avatar_color TEXT DEFAULT 'from-cyan-500 to-blue-600',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  league TEXT DEFAULT 'bronze' CHECK (league IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend')),
  league_points INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_time_played INTEGER DEFAULT 0,
  country TEXT DEFAULT 'FR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des parties
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('solo', 'friend', 'random', 'ranked')),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  current_question INTEGER DEFAULT 0,
  questions JSONB DEFAULT '[]'::jsonb,
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- Table de file d'attente matchmaking
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('random', 'ranked')),
  rating INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table des achievements débloqués
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Table des amitiés
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_league_points ON profiles(league_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_league ON profiles(league);
CREATE INDEX IF NOT EXISTS idx_games_player1 ON games(player1_id);
CREATE INDEX IF NOT EXISTS idx_games_player2 ON games(player2_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_matchmaking_mode ON matchmaking_queue(mode);
CREATE INDEX IF NOT EXISTS idx_matchmaking_rating ON matchmaking_queue(rating);

-- Fonction pour obtenir le rang d'un joueur
CREATE OR REPLACE FUNCTION get_player_rank(player_id UUID)
RETURNS INTEGER AS $$
DECLARE
  player_rank INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO player_rank
  FROM profiles p
  WHERE p.league_points > (
    SELECT league_points FROM profiles WHERE id = player_id
  );
  RETURN player_rank;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le niveau basé sur l'XP
CREATE OR REPLACE FUNCTION update_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Formule: niveau = floor(sqrt(xp / 100)) + 1
  NEW.level := FLOOR(SQRT(NEW.xp / 100.0)) + 1;
  
  -- Mise à jour de la ligue basée sur les points
  IF NEW.league_points >= 5000 THEN
    NEW.league := 'legend';
  ELSIF NEW.league_points >= 3000 THEN
    NEW.league := 'diamond';
  ELSIF NEW.league_points >= 1500 THEN
    NEW.league := 'platinum';
  ELSIF NEW.league_points >= 800 THEN
    NEW.league := 'gold';
  ELSIF NEW.league_points >= 300 THEN
    NEW.league := 'silver';
  ELSE
    NEW.league := 'bronze';
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mise à jour automatique du niveau
DROP TRIGGER IF EXISTS trigger_update_level ON profiles;
CREATE TRIGGER trigger_update_level
  BEFORE UPDATE OF xp, league_points ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_level();

-- Activer RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies pour games
CREATE POLICY "Games are viewable by participants" ON games
  FOR SELECT USING (true);

CREATE POLICY "Users can create games" ON games
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Participants can update games" ON games
  FOR UPDATE USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Policies pour matchmaking_queue
CREATE POLICY "Queue is viewable by everyone" ON matchmaking_queue
  FOR SELECT USING (true);

CREATE POLICY "Users can join queue" ON matchmaking_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave queue" ON matchmaking_queue
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour user_achievements
CREATE POLICY "Achievements are viewable by everyone" ON user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can unlock achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies pour friendships
CREATE POLICY "Friendships are viewable by participants" ON friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friendships" ON friendships
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Activer Realtime pour les tables
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- Commentaires
COMMENT ON TABLE profiles IS 'Profils des joueurs QQUIZ PRODIGY';
COMMENT ON TABLE games IS 'Historique des parties de quiz';
COMMENT ON TABLE matchmaking_queue IS 'File d''attente pour le matchmaking temps réel';
COMMENT ON TABLE user_achievements IS 'Achievements débloqués par les joueurs';
COMMENT ON TABLE friendships IS 'Relations d''amitié entre joueurs';
