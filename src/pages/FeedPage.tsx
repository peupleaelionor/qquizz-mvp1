import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Swords, Trophy, Flame, 
  Bell, MoreHorizontal, Zap, Star, Crown, Target, ChevronRight
} from 'lucide-react';
import { getAssetPath } from '@/lib/assets';
import DailyHub from '@/components/DailyHub';
import BottomNav from '@/components/BottomNav';

interface FeedPost {
  id: string;
  user: { name: string; avatar: string; level: number; badge: string; color: string };
  type: 'result' | 'challenge' | 'achievement' | 'levelup' | 'streak';
  content: string;
  details?: string;
  category?: string;
  score?: { player: number; opponent: number };
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: '1', user: { name: 'KingQuiz243', avatar: 'KQ', level: 15, badge: '🇨🇩', color: 'from-violet-600 to-fuchsia-600' },
    type: 'result', content: 'Victoire en RAP !', details: 'Score parfait - 10/10',
    category: 'rap', score: { player: 180, opponent: 120 },
    timestamp: 'Il y a 5min', likes: 34, comments: 8, liked: false
  },
  {
    id: '2', user: { name: 'ProdigyMaster', avatar: 'PM', level: 22, badge: '🇫🇷', color: 'from-cyan-500 to-blue-600' },
    type: 'streak', content: 'Série de 14 jours !', details: 'Inarrêtable ! Qui peut me battre ?',
    timestamp: 'Il y a 15min', likes: 56, comments: 12, liked: true
  },
  {
    id: '3', user: { name: 'LeopardKin', avatar: 'LK', level: 18, badge: '🇨🇩', color: 'from-green-500 to-emerald-600' },
    type: 'challenge', content: 'Défi ouvert en Manga !', details: 'Qui ose me défier en Manga ? Je suis imbattable !',
    category: 'manga', timestamp: 'Il y a 30min', likes: 22, comments: 15, liked: false
  },
  {
    id: '4', user: { name: 'BrainStorm', avatar: 'BS', level: 20, badge: '🇧🇪', color: 'from-yellow-500 to-orange-600' },
    type: 'achievement', content: 'Badge "Légende" débloqué !', details: 'A atteint la ligue Légende',
    timestamp: 'Il y a 1h', likes: 89, comments: 23, liked: false
  },
  {
    id: '5', user: { name: 'QuizNinja', avatar: 'QN', level: 16, badge: '🇸🇳', color: 'from-red-500 to-pink-600' },
    type: 'result', content: 'Victoire en NBA !', details: '9/10 - Combo x3 !',
    category: 'nba', score: { player: 165, opponent: 95 },
    timestamp: 'Il y a 2h', likes: 18, comments: 5, liked: false
  },
  {
    id: '6', user: { name: 'AfroQueen', avatar: 'AQ', level: 25, badge: '🇨🇮', color: 'from-purple-500 to-pink-500' },
    type: 'levelup', content: 'Niveau 25 atteint !', details: 'La reine du quiz monte en puissance',
    timestamp: 'Il y a 3h', likes: 112, comments: 31, liked: true
  },
];

function PostCard({ post, onLike }: { post: FeedPost; onLike: (id: string) => void }) {
  const navigate = useNavigate();

  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    result: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    challenge: { icon: Swords, color: 'text-red-400', bg: 'bg-red-500/10' },
    achievement: { icon: Star, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    levelup: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    streak: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  };

  const config = typeConfig[post.type] || typeConfig.result;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.user.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
          {post.user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-sm truncate">{post.user.name}</span>
            <span className="text-xs">{post.user.badge}</span>
            <span className="text-[9px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded-full">Niv.{post.user.level}</span>
          </div>
          <span className="text-[10px] text-white/25">{post.timestamp}</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-white/5">
          <MoreHorizontal className="w-4 h-4 text-white/20" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          </div>
          <span className="font-bold text-white text-sm">{post.content}</span>
        </div>
        {post.details && (
          <p className="text-xs text-white/40 ml-9">{post.details}</p>
        )}

        {/* Score display for results */}
        {post.type === 'result' && post.score && (
          <div className="flex items-center gap-3 mt-3 ml-9">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-bold text-green-400">{post.score.player} pts</span>
            </div>
            <span className="text-[10px] text-white/20 font-bold">VS</span>
            <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-bold text-red-400">{post.score.opponent} pts</span>
            </div>
          </div>
        )}

        {/* Streak display */}
        {post.type === 'streak' && (
          <div className="flex items-center gap-2 mt-3 ml-9">
            {Array.from({ length: Math.min(7, 14) }).map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-md flex items-center justify-center ${i < 14 ? 'bg-orange-500/20' : 'bg-white/5'}`}>
                <Flame className={`w-3 h-3 ${i < 14 ? 'text-orange-400' : 'text-white/10'}`} />
              </div>
            ))}
            <span className="text-[10px] text-orange-400 font-bold ml-1">+7</span>
          </div>
        )}

        {/* Challenge button */}
        {post.type === 'challenge' && (
          <button
            onClick={() => navigate('/')}
            className="mt-3 ml-9 flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/20 px-4 py-2 rounded-xl hover:border-red-500/40 transition-all active:scale-[0.98]"
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-bold text-red-400">Relever le défi</span>
          </button>
        )}

        {/* Level up animation */}
        {post.type === 'levelup' && (
          <div className="mt-3 ml-9 flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center">
              <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">25</span>
            </div>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full w-[45%]" />
            </div>
            <span className="text-[10px] text-white/20">26</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-white/5 mt-2">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
            post.liked ? 'bg-red-500/10 text-red-400' : 'hover:bg-white/5 text-white/30'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
          <span className="text-xs font-medium">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/30 transition-all active:scale-95">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/30 transition-all active:scale-95">
          <Share2 className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        {(post.type === 'result' || post.type === 'streak') && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-3 py-1.5 bg-violet-500/10 rounded-lg text-violet-400 hover:bg-violet-500/20 transition-all active:scale-95"
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">Défier</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<'daily' | 'feed'>('daily');

  const handleLike = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={getAssetPath('/images/logo/Icone_App_Dark.png')} alt="QQUIZ" className="w-8 h-8 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">QQUIZ</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="px-3 py-1.5 bg-violet-500/20 rounded-lg text-xs font-bold text-violet-400 hover:bg-violet-500/30 transition-all">
              Connexion
            </Link>
            <button className="relative w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white/40" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1">
          {[
            { id: 'daily' as const, label: 'Quotidien', icon: Target },
            { id: 'feed' as const, label: 'Activité', icon: Flame },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all relative ${
                activeTab === tab.id ? 'text-white' : 'text-white/30'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="feedTab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'daily' ? (
          <motion.div key="daily" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <DailyHub />
            
            {/* Quick Play Button */}
            <div className="px-4 mt-2 mb-4">
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-transform"
              >
                <Zap className="w-5 h-5" />
                Jouer Maintenant
              </button>
            </div>

            {/* Recent Activity Preview */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Activité récente</span>
                <button onClick={() => setActiveTab('feed')} className="flex items-center gap-1 text-xs text-violet-400">
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {posts.slice(0, 2).map(post => (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="feed" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="px-4 py-4 space-y-3">
            {/* Stories-like top bar */}
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
                  <span className="text-lg text-white/20">+</span>
                </div>
                <span className="text-[9px] text-white/30">Ton défi</span>
              </div>
              {posts.filter(p => p.type === 'challenge').map(p => (
                <div key={p.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${p.user.color} p-0.5`}>
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-white">
                      {p.user.avatar}
                    </div>
                  </div>
                  <span className="text-[9px] text-white/30 truncate max-w-[56px]">{p.user.name}</span>
                </div>
              ))}
            </div>

            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
