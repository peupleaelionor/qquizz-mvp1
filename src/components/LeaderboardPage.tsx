import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Swords,
  Filter,
  Globe,
  Users,
  Calendar
} from 'lucide-react';
import { loadUser, UserProfile, getLeagueBadge, getLeagueName } from '@/lib/userSystem';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

interface LeaderboardPlayer {
  rank: number;
  previousRank: number;
  username: string;
  avatar: string;
  avatarColor: string;
  level: number;
  league: UserProfile['league'];
  leaguePoints: number;
  wins: number;
  accuracy: number;
  country: string;
}

// Mock data pour le leaderboard
const generateMockPlayers = (): LeaderboardPlayer[] => {
  const names = [
    'ProdigyMaster', 'QuizKing243', 'BrainStorm', 'QuizNinja', 'MindReader',
    'GeniusPlayer', 'WizardQuiz', 'ChampionX', 'LegendKiller', 'MasterMind',
    'QuizLord', 'BrainiacPro', 'SmartGamer', 'QuizHero', 'TopPlayer',
    'EliteQuizzer', 'ProGamer', 'QuizStar', 'BrainPower', 'QuizAce',
    'MegaMind', 'QuizBoss', 'SuperBrain', 'QuizChamp', 'BrainMaster',
    'QuizGenius', 'TopBrain', 'QuizPro', 'BrainKing', 'QuizLegend'
  ];
  
  const countries = ['🇨🇩', '🇫🇷', '🇧🇪', '🇸🇳', '🇨🇲', '🇨🇮', '🇬🇦', '🇨🇬', '🇲🇱', '🇬🇳'];
  const avatars = ['PM', 'QK', 'BS', 'QN', 'MR', 'GN', 'WZ', 'CH'];
  const colors = [
    'from-violet-600 to-fuchsia-600',
    'from-cyan-500 to-blue-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600'
  ];

  const leagues: UserProfile['league'][] = ['legend', 'diamond', 'diamond', 'platinum', 'platinum', 'gold', 'gold', 'gold', 'silver', 'silver'];

  return names.map((name, index) => {
    const leagueIndex = Math.min(Math.floor(index / 3), leagues.length - 1);
    return {
      rank: index + 1,
      previousRank: index + 1 + Math.floor(Math.random() * 5) - 2,
      username: name,
      avatar: avatars[index % avatars.length],
      avatarColor: colors[index % colors.length],
      level: Math.max(1, 50 - index * 1.5 + Math.floor(Math.random() * 5)),
      league: leagues[leagueIndex] || 'bronze',
      leaguePoints: Math.max(0, 15000 - index * 500 + Math.floor(Math.random() * 200)),
      wins: Math.max(10, 500 - index * 15 + Math.floor(Math.random() * 50)),
      accuracy: Math.max(60, 98 - index * 0.5 + Math.floor(Math.random() * 5)),
      country: countries[index % countries.length]
    };
  });
};

type FilterType = 'global' | 'friends' | 'weekly';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<FilterType>('global');
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const user = loadUser();
    setCurrentUser(user);
    
    const mockPlayers = generateMockPlayers();
    
    // Insérer l'utilisateur actuel dans le classement
    if (user) {
      const userPlayer: LeaderboardPlayer = {
        rank: 0,
        previousRank: 0,
        username: user.username,
        avatar: user.avatar,
        avatarColor: user.avatarColor,
        level: user.level,
        league: user.league,
        leaguePoints: user.leaguePoints,
        wins: user.stats.wins,
        accuracy: user.stats.accuracy,
        country: '🇨🇩'
      };
      
      // Trouver la position de l'utilisateur
      let insertIndex = mockPlayers.findIndex(p => p.leaguePoints < user.leaguePoints);
      if (insertIndex === -1) insertIndex = mockPlayers.length;
      
      userPlayer.rank = insertIndex + 1;
      userPlayer.previousRank = insertIndex + 1 + Math.floor(Math.random() * 3) - 1;
      
      mockPlayers.splice(insertIndex, 0, userPlayer);
      
      // Recalculer les rangs
      mockPlayers.forEach((p, i) => {
        p.rank = i + 1;
      });
      
      setUserRank(insertIndex + 1);
    }
    
    setPlayers(mockPlayers);
  }, []);

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-400', text: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-400', text: `${diff}` };
    return { icon: Minus, color: 'text-white/30', text: '-' };
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black';
    if (rank === 3) return 'bg-gradient-to-r from-orange-600 to-amber-700 text-white';
    return 'bg-white/10 text-white';
  };

  const filters: { id: FilterType; label: string; icon: typeof Globe }[] = [
    { id: 'global', label: 'Mondial', icon: Globe },
    { id: 'friends', label: 'Amis', icon: Users },
    { id: 'weekly', label: 'Semaine', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
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
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Classement
        </h1>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl mx-auto"
        >
          {/* Filters */}
          <motion.div 
            variants={fadeInUp}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-center items-end gap-4 mb-8"
          >
            {/* 2nd Place */}
            {players[1] && (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${players[1].avatarColor} flex items-center justify-center text-xl font-bold text-white mx-auto mb-2 border-4 border-gray-400`}>
                  {players[1].avatar}
                </div>
                <div className="text-white font-medium text-sm truncate max-w-[80px]">{players[1].username}</div>
                <div className="text-gray-400 text-xs">{players[1].leaguePoints.toLocaleString()} pts</div>
                <div className="mt-2 w-16 h-20 bg-gradient-to-t from-gray-400/20 to-gray-400/40 rounded-t-lg flex items-center justify-center">
                  <Medal className="w-8 h-8 text-gray-300" />
                </div>
              </div>
            )}

            {/* 1st Place */}
            {players[0] && (
              <div className="text-center -mt-8">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-1 animate-pulse" />
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${players[0].avatarColor} flex items-center justify-center text-2xl font-bold text-white mx-auto mb-2 border-4 border-yellow-400 shadow-lg shadow-yellow-400/30`}>
                  {players[0].avatar}
                </div>
                <div className="text-white font-bold truncate max-w-[100px]">{players[0].username}</div>
                <div className="text-yellow-400 text-sm font-medium">{players[0].leaguePoints.toLocaleString()} pts</div>
                <div className="mt-2 w-20 h-28 bg-gradient-to-t from-yellow-500/20 to-yellow-500/40 rounded-t-lg flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {players[2] && (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${players[2].avatarColor} flex items-center justify-center text-xl font-bold text-white mx-auto mb-2 border-4 border-orange-600`}>
                  {players[2].avatar}
                </div>
                <div className="text-white font-medium text-sm truncate max-w-[80px]">{players[2].username}</div>
                <div className="text-orange-400 text-xs">{players[2].leaguePoints.toLocaleString()} pts</div>
                <div className="mt-2 w-16 h-16 bg-gradient-to-t from-orange-600/20 to-orange-600/40 rounded-t-lg flex items-center justify-center">
                  <Medal className="w-7 h-7 text-orange-500" />
                </div>
              </div>
            )}
          </motion.div>

          {/* User Position Card */}
          {currentUser && userRank && (
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-4 mb-6 border border-cyan-500/30"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${getRankStyle(userRank)} flex items-center justify-center font-bold text-sm`}>
                  {userRank}
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center font-bold text-white`}>
                  {currentUser.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{currentUser.username}</span>
                    <span className="text-cyan-400 text-sm">(Toi)</span>
                  </div>
                  <div className="text-white/50 text-sm">
                    {currentUser.leaguePoints.toLocaleString()} points • Niveau {currentUser.level}
                  </div>
                </div>
                <img 
                  src={getLeagueBadge(currentUser.league)}
                  alt={currentUser.league}
                  className="w-10 h-10 object-contain"
                />
              </div>
            </motion.div>
          )}

          {/* Leaderboard List */}
          <motion.div 
            variants={staggerContainer}
            className="space-y-2"
          >
            {players.slice(3).map((player, index) => {
              const rankChange = getRankChange(player.rank, player.previousRank);
              const isCurrentUser = currentUser && player.username === currentUser.username;
              
              return (
                <motion.div
                  key={player.rank}
                  variants={fadeInUp}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full ${getRankStyle(player.rank)} flex items-center justify-center font-bold text-sm`}>
                    {player.rank}
                  </div>

                  {/* Rank Change */}
                  <div className={`w-8 text-center ${rankChange.color}`}>
                    <rankChange.icon className="w-4 h-4 mx-auto" />
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${player.avatarColor} flex items-center justify-center font-bold text-white text-sm`}>
                    {player.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{player.username}</span>
                      <span>{player.country}</span>
                      {isCurrentUser && <span className="text-cyan-400 text-xs">(Toi)</span>}
                    </div>
                    <div className="text-white/50 text-xs">
                      Niv. {Math.floor(player.level)} • {player.wins} victoires • {player.accuracy}%
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-white font-bold">{player.leaguePoints.toLocaleString()}</div>
                    <div className="text-white/50 text-xs">points</div>
                  </div>

                  {/* League Badge */}
                  <img 
                    src={getLeagueBadge(player.league)}
                    alt={player.league}
                    className="w-8 h-8 object-contain"
                  />

                  {/* Challenge Button */}
                  {!isCurrentUser && (
                    <button className="p-2 rounded-full bg-white/10 hover:bg-violet-500/30 transition-colors">
                      <Swords className="w-4 h-4 text-violet-400" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
