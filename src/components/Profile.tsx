import { useState } from 'react';
import { motion } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPoints: number;
  bestStreak: number;
  currentStreak: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  favoriteCategory: string;
  rank: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const MOCK_STATS: Stats = {
  totalGames: 156,
  wins: 98,
  losses: 58,
  winRate: 62.8,
  totalPoints: 45230,
  bestStreak: 12,
  currentStreak: 5,
  questionsAnswered: 1560,
  correctAnswers: 1092,
  accuracy: 70,
  favoriteCategory: "Culture Générale",
  rank: 156,
  level: 25,
  xp: 7500,
  xpToNextLevel: 10000
};

const MOCK_BADGES: Badge[] = [
  { id: '1', name: 'Premier Pas', icon: '🎯', description: 'Complète ta première partie', unlocked: true, rarity: 'common' },
  { id: '2', name: 'En Feu', icon: '🔥', description: '5 bonnes réponses consécutives', unlocked: true, rarity: 'common' },
  { id: '3', name: 'Imbattable', icon: '⚡', description: '10 victoires consécutives', unlocked: true, rarity: 'rare' },
  { id: '4', name: 'Génie', icon: '🧠', description: '100% de précision sur une partie', unlocked: true, rarity: 'epic' },
  { id: '5', name: 'Légende', icon: '👑', description: 'Atteins le top 10 mondial', unlocked: false, rarity: 'legendary' },
  { id: '6', name: 'Social', icon: '🤝', description: 'Ajoute 10 amis', unlocked: true, rarity: 'common' },
  { id: '7', name: 'Challenger', icon: '⚔️', description: 'Gagne 50 duels', unlocked: true, rarity: 'rare' },
  { id: '8', name: 'Encyclopédie', icon: '📚', description: 'Réponds à 1000 questions', unlocked: true, rarity: 'epic' },
];

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const RARITY_BORDERS = {
  common: 'border-gray-400/50',
  rare: 'border-blue-400/50',
  epic: 'border-purple-400/50',
  legendary: 'border-yellow-400/50'
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'history'>('stats');

  const xpProgress = (MOCK_STATS.xp / MOCK_STATS.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pb-20">
      {/* Header Profile */}
      <div className="relative">
        {/* Background Banner */}
        <div className="h-32 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
        
        {/* Profile Info */}
        <div className="px-4 -mt-16">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-1"
            >
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-4xl font-black text-white">PG</span>
              </div>
            </motion.div>

            {/* Name & Level */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-black text-white">ProGamer243</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white text-sm font-bold">
                  Niveau {MOCK_STATS.level}
                </span>
                <span className="text-gray-400">#{MOCK_STATS.rank} Mondial</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">XP</span>
              <span className="text-cyan-400">{MOCK_STATS.xp.toLocaleString()} / {MOCK_STATS.xpToNextLevel.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 p-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
        >
          <div className="text-2xl font-black text-cyan-400">{MOCK_STATS.totalGames}</div>
          <div className="text-gray-400 text-sm">Parties</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
        >
          <div className="text-2xl font-black text-green-400">{MOCK_STATS.wins}</div>
          <div className="text-gray-400 text-sm">Victoires</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
        >
          <div className="text-2xl font-black text-fuchsia-400">{MOCK_STATS.winRate}%</div>
          <div className="text-gray-400 text-sm">Win Rate</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {(['stats', 'badges', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'stats' ? 'Stats' : tab === 'badges' ? 'Badges' : 'Historique'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Performance */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-bold mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Total Points</div>
                  <div className="text-xl font-bold text-cyan-400">{MOCK_STATS.totalPoints.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Précision</div>
                  <div className="text-xl font-bold text-green-400">{MOCK_STATS.accuracy}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Meilleur Streak</div>
                  <div className="text-xl font-bold text-orange-400">{MOCK_STATS.bestStreak}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Streak Actuel</div>
                  <div className="text-xl font-bold text-fuchsia-400">{MOCK_STATS.currentStreak}</div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-bold mb-4">Questions</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Répondues</span>
                <span className="text-white font-bold">{MOCK_STATS.questionsAnswered}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Correctes</span>
                <span className="text-green-400 font-bold">{MOCK_STATS.correctAnswers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Catégorie Favorite</span>
                <span className="text-cyan-400 font-bold">{MOCK_STATS.favoriteCategory}</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {MOCK_BADGES.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border ${
                  badge.unlocked ? RARITY_BORDERS[badge.rarity] : 'border-white/10 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${
                  badge.unlocked ? RARITY_COLORS[badge.rarity] : 'from-gray-600 to-gray-700'
                } flex items-center justify-center text-2xl`}>
                  {badge.unlocked ? badge.icon : '🔒'}
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold text-sm">{badge.name}</div>
                  <div className="text-gray-400 text-xs mt-1">{badge.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {[
              { opponent: 'QuizKing243', result: 'win', score: '1250 - 980', time: 'Il y a 2h' },
              { opponent: 'BrainStorm', result: 'win', score: '1100 - 850', time: 'Il y a 5h' },
              { opponent: 'MasterMind', result: 'loss', score: '920 - 1150', time: 'Hier' },
              { opponent: 'QuizNinja', result: 'win', score: '1300 - 1100', time: 'Hier' },
              { opponent: 'GeniusPlayer', result: 'loss', score: '800 - 950', time: 'Il y a 2j' },
            ].map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border ${
                  game.result === 'win' ? 'border-green-500/30' : 'border-red-500/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  game.result === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {game.result === 'win' ? 'V' : 'D'}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">vs {game.opponent}</div>
                  <div className="text-gray-400 text-sm">{game.time}</div>
                </div>
                <div className={`font-bold ${game.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                  {game.score}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
