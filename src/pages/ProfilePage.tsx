import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Trophy,
  Target,
  Flame,
  Clock,
  Star,
  Award,
  TrendingUp,
  Edit3,
  Settings,
  Share2,
  ChevronRight
} from 'lucide-react';
import { 
  UserProfile, 
  loadUser, 
  saveUser, 
  createNewUser,
  getLeagueBadge,
  getLeagueName,
  formatPlayTime,
  AVATARS,
  AVATAR_COLORS
} from '@/lib/userSystem';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    let currentUser = loadUser();
    if (!currentUser) {
      currentUser = createNewUser('Joueur' + Math.floor(Math.random() * 10000));
      saveUser(currentUser);
    }
    setUser(currentUser);
    setNewUsername(currentUser.username);
  }, []);

  const handleSaveUsername = () => {
    if (user && newUsername.trim()) {
      const updatedUser = { ...user, username: newUsername.trim() };
      saveUser(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (avatarId: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarId };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const handleColorChange = (color: string) => {
    if (user) {
      const updatedUser = { ...user, avatarColor: color };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const xpProgress = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl mx-auto"
        >
          {/* Profile Header */}
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-8"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-4xl font-black text-white shadow-2xl`}>
                {user.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10">
                <img 
                  src={getLeagueBadge(user.league)} 
                  alt={user.league}
                  className="w-full h-full object-contain"
                />
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -top-1 -right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-400 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Username */}
            {isEditing ? (
              <div className="flex items-center justify-center gap-2 mb-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-center focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
                <button 
                  onClick={handleSaveUsername}
                  className="px-4 py-2 bg-cyan-500 rounded-lg text-white font-medium hover:bg-cyan-400 transition-colors"
                >
                  OK
                </button>
              </div>
            ) : (
              <h1 className="text-3xl font-black text-white mb-1">{user.username}</h1>
            )}
            
            <p className="text-cyan-400 font-medium">{getLeagueName(user.league)} League</p>
          </motion.div>

          {/* Level & XP */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-white/50 text-sm">Niveau</span>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  {user.level}
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/50 text-sm">XP Total</span>
                <div className="text-2xl font-bold text-white">
                  {user.totalXp.toLocaleString()}
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-white/50 mb-1">
                <span>{user.xp} XP</span>
                <span>{user.xpToNextLevel} XP</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                />
              </div>
            </div>
            <p className="text-center text-white/50 text-sm">
              {user.xpToNextLevel - user.xp} XP pour le niveau {user.level + 1}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold text-white">{user.stats.wins}</div>
              <div className="text-white/50 text-sm">Victoires</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Target className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold text-white">{user.stats.accuracy}%</div>
              <div className="text-white/50 text-sm">Précision</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Flame className="w-6 h-6 text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-white">{user.stats.bestStreak}</div>
              <div className="text-white/50 text-sm">Meilleure série</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Clock className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">{formatPlayTime(user.stats.totalPlayTime)}</div>
              <div className="text-white/50 text-sm">Temps de jeu</div>
            </div>
          </motion.div>

          {/* Detailed Stats */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Statistiques détaillées
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Parties jouées</span>
                <span className="text-white font-medium">{user.stats.totalGames}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Questions répondues</span>
                <span className="text-white font-medium">{user.stats.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Bonnes réponses</span>
                <span className="text-white font-medium">{user.stats.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Taux de victoire</span>
                <span className="text-white font-medium">{user.stats.winRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Points de ligue</span>
                <span className="text-white font-medium">{user.leaguePoints}</span>
              </div>
              {user.stats.favoriteCategory && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Catégorie favorite</span>
                  <span className="text-cyan-400 font-medium">{user.stats.favoriteCategory}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              <span className="text-white/50 text-sm">
                {user.achievements.filter(a => a.unlocked).length}/{user.achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {user.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`relative aspect-square rounded-xl flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border border-purple-500/30' 
                      : 'bg-white/5 border border-white/10 opacity-50'
                  }`}
                >
                  <img 
                    src={achievement.image}
                    alt={achievement.name}
                    className={`w-12 h-12 object-contain ${!achievement.unlocked && 'grayscale'}`}
                  />
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* League Progress */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Progression Ligue
            </h3>
            <div className="flex justify-between items-center">
              {['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'].map((league, index) => (
                <div 
                  key={league}
                  className={`flex flex-col items-center ${
                    user.league === league ? 'scale-110' : 'opacity-50'
                  }`}
                >
                  <img 
                    src={`/images/badges/Badge_${league.charAt(0).toUpperCase() + league.slice(1) === 'Silver' ? 'Argent' : league.charAt(0).toUpperCase() + league.slice(1) === 'Gold' ? 'Or' : league.charAt(0).toUpperCase() + league.slice(1) === 'Legend' ? 'Legende' : league.charAt(0).toUpperCase() + league.slice(1)}.png`}
                    alt={league}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsEditing(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-6">Personnaliser le profil</h3>
            
            {/* Username */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block">Pseudo</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Avatar Selection */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block">Avatar</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarChange(avatar.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                      user.avatar === avatar.id
                        ? `bg-gradient-to-br ${user.avatarColor} border-2 border-cyan-400`
                        : 'bg-white/10 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {avatar.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block">Couleur</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`aspect-square rounded-xl bg-gradient-to-br ${color} transition-all ${
                      user.avatarColor === color
                        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUsername}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold hover:from-cyan-400 hover:to-purple-500 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
