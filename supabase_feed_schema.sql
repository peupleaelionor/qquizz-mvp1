-- =====================================================
-- QQUIZ PRODIGY - Schema Fil d'Actualité Social
-- =====================================================

-- Types de posts
CREATE TYPE post_type AS ENUM (
  'result',      -- Résultat de quiz partagé
  'challenge',   -- Défi lancé à la communauté
  'achievement', -- Achievement débloqué
  'level_up',    -- Montée de niveau
  'league_up',   -- Promotion de ligue
  'streak',      -- Série de victoires
  'status'       -- Status texte simple
);

-- Table des posts du fil d'actualité
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type post_type NOT NULL DEFAULT 'status',
  content TEXT,
  -- Données spécifiques selon le type
  category TEXT,           -- Catégorie du quiz
  score INTEGER,           -- Score obtenu
  opponent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  opponent_score INTEGER,
  is_victory BOOLEAN,
  achievement_id TEXT,     -- ID de l'achievement
  new_level INTEGER,       -- Nouveau niveau atteint
  new_league TEXT,         -- Nouvelle ligue
  streak_count INTEGER,    -- Nombre de victoires consécutives
  -- Challenge spécifique
  challenge_category TEXT,
  challenge_difficulty TEXT,
  challenge_expires_at TIMESTAMPTZ,
  challenge_accepted_by UUID[],
  -- Métadonnées
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des likes
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Table des commentaires
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des likes sur commentaires
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'like', 'comment', 'challenge', 'friend_request', 'match_found', 'achievement'
  from_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des défis
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenged_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL = défi public
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'expired', 'declined')),
  challenger_score INTEGER,
  challenged_score INTEGER,
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_challenged ON challenges(challenged_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);

-- Fonction pour incrémenter les likes
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour décrémenter les likes
CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour incrémenter les commentaires
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour décrémenter les commentaires
CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_increment_likes ON post_likes;
CREATE TRIGGER trigger_increment_likes
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION increment_post_likes();

DROP TRIGGER IF EXISTS trigger_decrement_likes ON post_likes;
CREATE TRIGGER trigger_decrement_likes
  AFTER DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_post_likes();

DROP TRIGGER IF EXISTS trigger_increment_comments ON post_comments;
CREATE TRIGGER trigger_increment_comments
  AFTER INSERT ON post_comments
  FOR EACH ROW EXECUTE FUNCTION increment_post_comments();

DROP TRIGGER IF EXISTS trigger_decrement_comments ON post_comments;
CREATE TRIGGER trigger_decrement_comments
  AFTER DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION decrement_post_comments();

-- Fonction pour créer une notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_from_user_id UUID DEFAULT NULL,
  p_post_id UUID DEFAULT NULL,
  p_content TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, from_user_id, post_id, content)
  VALUES (p_user_id, p_type, p_from_user_id, p_post_id, p_content)
  RETURNING id INTO notification_id;
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Activer RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Policies pour posts
CREATE POLICY "Posts publics visibles par tous" ON posts
  FOR SELECT USING (is_public = true);

CREATE POLICY "Utilisateurs peuvent créer des posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent modifier leurs posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent supprimer leurs posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour likes
CREATE POLICY "Likes visibles par tous" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent liker" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent unliker" ON post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour commentaires
CREATE POLICY "Commentaires visibles par tous" ON post_comments
  FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent commenter" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent modifier leurs commentaires" ON post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent supprimer leurs commentaires" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour notifications
CREATE POLICY "Utilisateurs voient leurs notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Système peut créer des notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Utilisateurs peuvent marquer comme lu" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies pour challenges
CREATE POLICY "Challenges visibles par tous" ON challenges
  FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent créer des challenges" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Participants peuvent modifier les challenges" ON challenges
  FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Activer Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE challenges;

-- Commentaires
COMMENT ON TABLE posts IS 'Posts du fil d''actualité social QQUIZ PRODIGY';
COMMENT ON TABLE post_likes IS 'Likes sur les posts';
COMMENT ON TABLE post_comments IS 'Commentaires sur les posts';
COMMENT ON TABLE notifications IS 'Notifications temps réel';
COMMENT ON TABLE challenges IS 'Défis entre joueurs';
