import { useState } from 'react';
import { motion } from 'framer-motion';

interface Player {
  id: number;
  username: string;
  avatar: string;
  score: number;
  level: number;
  country: string;
  wins: number;
  streak: number;
}

const MOCK_PLAYERS: Player[] = [
  { id: 1, username: "ProdigyMaster", avatar: "PM", score: 15420, level: 45, country: "CD", wins: 234, streak: 12 },
  { id: 2, username: "QuizKing243", avatar: "QK", score: 14850, level: 42, country: "CD", wins: 198, streak: 8 },
  { id: 3, username: "BrainStorm", avatar: "BS", score: 13200, level: 38, country: "CG", wins: 176, streak: 5 },
  { id: 4, username: "KinshasaChamp", avatar: "KC", score: 12100, level: 35, country: "CD", wins: 156, streak: 3 },
  { id: 5, username: "MasterMind", avatar: "MM", score: 11500, level: 33, country: "FR", wins: 145, streak: 7 },
  { id: 6, username: "QuizNinja", avatar: "QN", score: 10800, level: 31, country: "BE", wins: 132, streak: 4 },
  { id: 7, username: "GeniusPlayer", avatar: "GP", score: 10200, level: 29, country: "CD", wins: 121, streak: 2 },
  { id: 8, username: "SmartCookie", avatar: "SC", score: 9800, level: 27, country: "SN", wins: 115, streak: 6 },
  { id: 9, username: "BrainiacPro", avatar: "BP", score: 9200, level: 25, country: "CI", wins: 108, streak: 1 },
  { id: 10, username: "QuizWizard", avatar: "QW", score: 8900, level: 24, country: "CD", wins: 102, streak: 9 },
];

const COUNTRY_FLAGS: Record<string, string> = {
  "CD": "🇨🇩",
  "CG": "🇨🇬",
  "FR": "🇫🇷",
  "BE": "🇧🇪",
  "SN": "🇸🇳",
  "CI": "🇨🇮",
};

type TabType = 'global' | 'weekly' | 'friends';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [currentUserRank] = useState(156);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'global', label: 'Global' },
    { id: 'weekly', label: 'Semaine' },
    { id: 'friends', label: 'Amis' },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-amber-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-slate-600 to-slate-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-black text-white mb-2">
          CLASSEMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">MONDIAL</span>
        </h1>
        <p className="text-gray-400">Saison 1 - Semaine 4</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-8 h-48">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xl font-bold text-slate-800 shadow-lg">
            {MOCK_PLAYERS[1].avatar}
          </div>
          <div className="text-white font-semibold text-sm mb-1">{MOCK_PLAYERS[1].username}</div>
          <div className="text-cyan-400 font-bold">{MOCK_PLAYERS[1].score.toLocaleString()}</div>
          <div className="w-20 h-24 bg-gradient-to-t from-gray-500/30 to-gray-400/50 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-3xl">🥈</span>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(234, 179, 8, 0.5)",
                "0 0 40px rgba(234, 179, 8, 0.8)",
                "0 0 20px rgba(234, 179, 8, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-2xl font-bold text-slate-800"
          >
            {MOCK_PLAYERS[0].avatar}
          </motion.div>
          <div className="text-white font-bold mb-1">{MOCK_PLAYERS[0].username}</div>
          <div className="text-yellow-400 font-bold text-lg">{MOCK_PLAYERS[0].score.toLocaleString()}</div>
          <div className="w-24 h-32 bg-gradient-to-t from-yellow-500/30 to-yellow-400/50 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-4xl">👑</span>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl font-bold text-slate-800 shadow-lg">
            {MOCK_PLAYERS[2].avatar}
          </div>
          <div className="text-white font-semibold text-sm mb-1">{MOCK_PLAYERS[2].username}</div>
          <div className="text-orange-400 font-bold">{MOCK_PLAYERS[2].score.toLocaleString()}</div>
          <div className="w-20 h-20 bg-gradient-to-t from-orange-500/30 to-orange-400/50 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-3xl">🥉</span>
          </div>
        </motion.div>
      </div>

      {/* Player List */}
      <div className="max-w-2xl mx-auto space-y-3">
        {MOCK_PLAYERS.slice(3).map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:border-violet-500/50 transition-colors"
          >
            {/* Rank */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(index + 4)} flex items-center justify-center font-bold text-white`}>
              {index + 4}
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white">
              {player.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{player.username}</span>
                <span className="text-lg">{COUNTRY_FLAGS[player.country]}</span>
              </div>
              <div className="text-gray-400 text-sm">
                Niveau {player.level} • {player.wins} victoires
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-cyan-400 font-bold">{player.score.toLocaleString()}</div>
              {player.streak >= 3 && (
                <div className="text-orange-400 text-sm font-medium">
                  {player.streak}x streak
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current User Position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 backdrop-blur-lg rounded-xl p-4 flex items-center gap-4 border border-white/20 shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
            #{currentUserRank}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
            Toi
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold">Ta position</div>
            <div className="text-white/70 text-sm">Niveau 25 • 45 victoires</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">4,250</div>
            <div className="text-white/70 text-sm">points</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
