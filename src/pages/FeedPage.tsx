import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { feedService, notificationService, challengeService, Post, Challenge, Notification } from '@/lib/feedService';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Zap, 
  Star, 
  TrendingUp,
  Crown,
  Target,
  Flame,
  Bell,
  ChevronRight,
  Send,
  X,
  Home,
  Users,
  User,
  Award
} from 'lucide-react';

// Composant Post Card
function PostCard({ post, onLike, onComment }: { post: Post; onLike: (id: string) => void; onComment: (id: string) => void }) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const getPostContent = () => {
    switch (post.type) {
      case 'result':
        return (
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400 uppercase tracking-wider">{post.category}</span>
              {post.is_victory ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> Victoire
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
                  Défaite
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{post.score}</div>
                <div className="text-sm text-gray-400">{post.user?.username}</div>
              </div>
              <div className="text-2xl font-bold text-gray-500">VS</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{post.opponent_score || '-'}</div>
                <div className="text-sm text-gray-400">{post.opponent?.username || 'Solo'}</div>
              </div>
            </div>
          </div>
        );
      
      case 'achievement':
        return (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-yellow-400 font-semibold">Achievement débloqué !</p>
              <p className="text-white text-lg font-bold">{post.achievement_id}</p>
            </div>
          </div>
        );
      
      case 'level_up':
        return (
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">Level Up !</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Niveau {post.new_level}
            </div>
          </div>
        );
      
      case 'league_up':
        const leagueColors: Record<string, string> = {
          bronze: 'from-amber-600 to-amber-800',
          silver: 'from-gray-300 to-gray-500',
          gold: 'from-yellow-400 to-yellow-600',
          platinum: 'from-cyan-300 to-cyan-500',
          diamond: 'from-blue-400 to-purple-500',
          legend: 'from-purple-500 to-pink-500'
        };
        return (
          <div className={`bg-gradient-to-r ${leagueColors[post.new_league || 'bronze']}/20 rounded-xl p-4 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Promotion !</span>
            </div>
            <div className="text-2xl font-bold text-white capitalize">
              Ligue {post.new_league}
            </div>
          </div>
        );
      
      case 'challenge':
        return (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">Défi lancé !</span>
            </div>
            <p className="text-white mb-3">
              Qui peut me battre en <span className="font-bold text-cyan-400">{post.challenge_category}</span> ?
            </p>
            <Button className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
              <Zap className="w-4 h-4 mr-2" />
              Relever le défi
            </Button>
          </div>
        );
      
      case 'streak':
        return (
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-orange-400 font-semibold">Série en feu !</span>
            </div>
            <div className="text-4xl font-bold text-orange-400">
              {post.streak_count} victoires
            </div>
          </div>
        );
      
      default:
        return post.content ? (
          <p className="text-gray-300">{post.content}</p>
        ) : null;
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}j`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 mb-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${post.user?.avatar_color || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-white font-bold`}>
          {post.user?.username?.substring(0, 2).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{post.user?.username}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
              Niv. {post.user?.level}
            </span>
          </div>
          <span className="text-sm text-gray-500">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Content */}
      {getPostContent()}

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-800">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments_count}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
          <Share2 className="w-5 h-5" />
          <span>Partager</span>
        </button>
      </div>
    </motion.div>
  );
}

// Composant Challenge Card
function ChallengeCard({ challenge, onAccept }: { challenge: Challenge; onAccept: (id: string) => void }) {
  const timeLeft = () => {
    const expires = new Date(challenge.expires_at).getTime();
    const now = new Date().getTime();
    const hours = Math.floor((expires - now) / (1000 * 60 * 60));
    if (hours < 1) return 'Expire bientôt';
    return `${hours}h restantes`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4 min-w-[280px]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${challenge.challenger?.avatar_color || 'from-red-500 to-orange-600'} flex items-center justify-center text-white font-bold text-sm`}>
          {challenge.challenger?.username?.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-white">{challenge.challenger?.username}</p>
          <p className="text-xs text-gray-400">Niv. {challenge.challenger?.level}</p>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-1">Catégorie</p>
        <p className="font-bold text-white capitalize">{challenge.category}</p>
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-orange-400">{timeLeft()}</span>
        <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400 capitalize">
          {challenge.difficulty}
        </span>
      </div>
      <Button
        onClick={() => onAccept(challenge.id)}
        className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
        size="sm"
      >
        <Zap className="w-4 h-4 mr-2" />
        Accepter
      </Button>
    </motion.div>
  );
}

// Page principale du Feed
export default function FeedPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        const [feedData, challengesData] = await Promise.all([
          feedService.getFeed(20),
          challengeService.getPublicChallenges(10)
        ]);
        setPosts(feedData);
        setChallenges(challengesData);

        if (user) {
          const [notifs, count] = await Promise.all([
            notificationService.getNotifications(user.id, 20),
            notificationService.getUnreadCount(user.id)
          ]);
          setNotifications(notifs);
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Erreur chargement feed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // S'abonner aux notifications temps réel
  useEffect(() => {
    if (!user) return;

    const subscription = notificationService.subscribeToNotifications(
      user.id,
      (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const post = posts.find(p => p.id === postId);
      if (post?.is_liked) {
        await feedService.unlikePost(postId, user.id);
      } else {
        await feedService.likePost(postId, user.id);
      }
    } catch (error) {
      console.error('Erreur like:', error);
    }
  };

  const handleComment = (postId: string) => {
    // TODO: Ouvrir modal de commentaires
    console.log('Comment on post:', postId);
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    if (!user) return;
    try {
      await challengeService.acceptChallenge(challengeId, user.id);
      // Rediriger vers le quiz
      navigate('/play');
    } catch (error) {
      console.error('Erreur acceptation défi:', error);
    }
  };

  // Données de démonstration si pas de posts
  const demoPosts: Post[] = [
    {
      id: '1',
      user_id: 'demo1',
      type: 'result',
      category: 'Rap',
      score: 980,
      opponent_score: 750,
      is_victory: true,
      likes_count: 24,
      comments_count: 5,
      shares_count: 2,
      is_public: true,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: { id: 'demo1', username: 'KingQuiz243', avatar_color: 'from-purple-500 to-pink-600', level: 15, league: 'gold' }
    },
    {
      id: '2',
      user_id: 'demo2',
      type: 'level_up',
      new_level: 20,
      likes_count: 45,
      comments_count: 12,
      shares_count: 0,
      is_public: true,
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user: { id: 'demo2', username: 'ProdigyMaster', avatar_color: 'from-cyan-500 to-blue-600', level: 20, league: 'platinum' }
    },
    {
      id: '3',
      user_id: 'demo3',
      type: 'challenge',
      challenge_category: 'Football Africain',
      challenge_difficulty: 'hard',
      likes_count: 18,
      comments_count: 8,
      shares_count: 5,
      is_public: true,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      user: { id: 'demo3', username: 'LeopardKin', avatar_color: 'from-green-500 to-yellow-500', level: 12, league: 'silver' }
    },
    {
      id: '4',
      user_id: 'demo4',
      type: 'streak',
      streak_count: 10,
      likes_count: 67,
      comments_count: 23,
      shares_count: 8,
      is_public: true,
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      user: { id: 'demo4', username: 'FireQueen', avatar_color: 'from-orange-500 to-red-600', level: 25, league: 'diamond' }
    },
    {
      id: '5',
      user_id: 'demo5',
      type: 'league_up',
      new_league: 'gold',
      likes_count: 89,
      comments_count: 31,
      shares_count: 12,
      is_public: true,
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      user: { id: 'demo5', username: 'ChampionRDC', avatar_color: 'from-yellow-400 to-amber-600', level: 18, league: 'gold' }
    }
  ];

  const displayPosts = posts.length > 0 ? posts : demoPosts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              QQUIZ
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            {profile ? (
              <Link to="/profile" className={`w-10 h-10 rounded-full bg-gradient-to-br ${profile.avatar_color} flex items-center justify-center text-white font-bold`}>
                {profile.username?.substring(0, 2).toUpperCase()}
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600">
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-50 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-white">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-gray-800 ${!notif.is_read ? 'bg-cyan-500/5' : ''}`}>
                    <p className="text-sm text-gray-300">{notif.content || 'Nouvelle notification'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Aucune notification
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Défis en cours */}
        {challenges.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              Défis ouverts
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {challenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAccept={handleAcceptChallenge}
                />
              ))}
            </div>
          </section>
        )}

        {/* Feed */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Fil d'actualité
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div>
              {displayPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-800 py-2 px-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs">Accueil</span>
          </Link>
          <Link to="/feed" className="flex flex-col items-center gap-1 text-cyan-400">
            <Flame className="w-6 h-6" />
            <span className="text-xs">Feed</span>
          </Link>
          <Link to="/play" className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 -mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Classement</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
