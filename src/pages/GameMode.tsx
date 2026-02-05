import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Users, 
  Globe, 
  Zap, 
  Trophy,
  ArrowLeft,
  Clock,
  Target,
  Flame
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

interface GameModeProps {
  category?: string;
  categoryName?: string;
}

export default function GameMode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, categoryName } = (location.state as GameModeProps) || {};
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const gameModes = [
    {
      id: 'solo',
      name: 'Solo',
      description: 'Entraîne-toi seul et améliore tes stats',
      icon: User,
      color: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/30',
      features: ['Sans pression', 'Pas de limite de temps', 'Parfait pour apprendre']
    },
    {
      id: 'friend',
      name: 'Contre un Ami',
      description: 'Défie un ami en duel privé',
      icon: Users,
      color: 'from-purple-500 to-fuchsia-600',
      shadowColor: 'shadow-purple-500/30',
      features: ['Invite par lien', 'Match privé', 'Classement entre amis']
    },
    {
      id: 'random',
      name: 'Adversaire Aléatoire',
      description: 'Affronte un joueur du monde entier',
      icon: Globe,
      color: 'from-orange-500 to-red-600',
      shadowColor: 'shadow-orange-500/30',
      features: ['Matchmaking rapide', 'Joueurs du monde', 'Points de ligue']
    },
    {
      id: 'ranked',
      name: 'Classé',
      description: 'Grimpe dans le classement mondial',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      shadowColor: 'shadow-yellow-500/30',
      features: ['Elo rating', 'Saisons', 'Récompenses exclusives']
    }
  ];

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    
    // Animation puis navigation
    setTimeout(() => {
      navigate('/play', { 
        state: { 
          category, 
          categoryName,
          gameMode: modeId 
        } 
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            {categoryName && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-500/30 mb-4">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-medium">{categoryName}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Choisis ton <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Mode</span>
            </h1>
            <p className="text-white/60 text-lg">
              Comment veux-tu jouer ?
            </p>
          </motion.div>

          {/* Game Modes Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {gameModes.map((mode) => (
              <motion.button
                key={mode.id}
                variants={fadeInUp}
                onClick={() => handleModeSelect(mode.id)}
                className={`relative p-6 rounded-2xl border transition-all duration-300 text-left group ${
                  selectedMode === mode.id
                    ? `bg-gradient-to-br ${mode.color} border-transparent shadow-2xl ${mode.shadowColor} scale-105`
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg ${mode.shadowColor}`}>
                  <mode.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-2">{mode.name}</h3>
                <p className="text-white/60 mb-4">{mode.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {mode.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            variants={fadeInUp}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15s</div>
              <div className="text-xs text-white/50">Par question</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">10</div>
              <div className="text-xs text-white/50">Questions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3x</div>
              <div className="text-xs text-white/50">Combo max</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
