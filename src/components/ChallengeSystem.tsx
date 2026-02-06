/**
 * QQUIZ PRODIGY - Challenge System V8
 * Système de défi 1v1 avec invitations et partage
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../lib/assets';
import soundSystem from '../lib/soundSystem';

interface Challenge {
  id: string;
  challenger: {
    name: string;
    level: number;
    avatar: string;
    league: string;
    country: string;
  };
  category: string;
  categoryImage: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// Génération de défis simulés
function generateMockChallenges(): Challenge[] {
  const challengers = [
    { name: 'KingQuiz243', level: 18, avatar: 'KQ', league: 'diamond', country: '🇨🇩' },
    { name: 'BrainStorm', level: 22, avatar: 'BS', league: 'legend', country: '🇫🇷' },
    { name: 'QuizNinja', level: 15, avatar: 'QN', league: 'platinum', country: '🇧🇪' },
    { name: 'MindReader', level: 12, avatar: 'MR', league: 'gold', country: '🇸🇳' },
  ];
  
  const categories = [
    { name: 'Rap', image: 'Cat_Rap.png' },
    { name: 'Football', image: 'Cat_Sport.png' },
    { name: 'Manga', image: 'Cat_Manga.png' },
    { name: 'NBA', image: 'Cat_NBA.png' },
  ];

  return challengers.map((c, i) => ({
    id: `challenge_${i}`,
    challenger: c,
    category: categories[i % categories.length].name,
    categoryImage: categories[i % categories.length].image,
    status: 'pending' as const,
    createdAt: new Date(Date.now() - Math.random() * 3600000),
    expiresAt: new Date(Date.now() + 3600000),
  }));
}

function ChallengeCard({ challenge, onAccept, onDecline }: {
  challenge: Challenge;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const leagueColors: Record<string, string> = {
    bronze: 'from-amber-700 to-amber-900',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-cyan-600',
    diamond: 'from-blue-400 to-purple-500',
    legend: 'from-fuchsia-500 to-violet-600',
  };

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "A l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    return `Il y a ${Math.floor(minutes / 60)}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-2xl p-4 border border-violet-500/20 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${leagueColors[challenge.challenger.league] || leagueColors.bronze} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
          {challenge.challenger.avatar}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">{challenge.challenger.name}</span>
            <span className="text-lg">{challenge.challenger.country}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>Niv. {challenge.challenger.level}</span>
            <span>·</span>
            <span>{timeAgo(challenge.createdAt)}</span>
          </div>
        </div>

        {/* Catégorie */}
        <div className="text-center">
          <img 
            src={getAssetPath(`/images/categories/${challenge.categoryImage}`)}
            alt={challenge.category}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="text-[10px] text-white/60 mt-1 block">{challenge.category}</span>
        </div>
      </div>

      {/* Message de défi */}
      <div className="bg-violet-500/10 rounded-xl p-3 mb-3 border border-violet-500/10">
        <p className="text-white/80 text-sm text-center font-medium">
          Te défie en <span className="text-violet-400 font-bold">{challenge.category}</span> !
        </p>
      </div>

      {/* Boutons */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { soundSystem.playClick(); onDecline(challenge.id); }}
          className="flex-1 py-2.5 rounded-xl bg-slate-700/50 text-white/60 font-semibold text-sm border border-slate-600/30 active:bg-slate-600/50"
        >
          Refuser
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { soundSystem.playSelect(); onAccept(challenge.id); }}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-violet-500/30 active:from-violet-700 active:to-fuchsia-700"
        >
          Accepter
        </motion.button>
      </div>
    </motion.div>
  );
}

function CreateChallengeModal({ isOpen, onClose, onSend }: {
  isOpen: boolean;
  onClose: () => void;
  onSend: (category: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = [
    { id: 'rap', name: 'Rap', image: 'Cat_Rap.png' },
    { id: 'sport', name: 'Sport', image: 'Cat_Sport.png' },
    { id: 'manga', name: 'Manga', image: 'Cat_Manga.png' },
    { id: 'nba', name: 'NBA', image: 'Cat_NBA.png' },
    { id: 'afrique', name: 'Afrique', image: 'Cat_Afrique.png' },
    { id: 'netflix', name: 'Netflix', image: 'Cat_Netflix.png' },
    { id: 'football_africain', name: 'Foot Africain', image: 'Cat_FootballAfricain.png' },
    { id: 'kpop', name: 'K-Pop', image: 'Cat_Kpop.png' },
    { id: 'tiktok', name: 'TikTok', image: 'Cat_TikTok.png' },
    { id: 'marvel', name: 'Marvel', image: 'Cat_Marvel.png' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-violet-500/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-white text-center mb-1">Lancer un Défi</h3>
          <p className="text-white/50 text-sm text-center mb-6">Choisis une catégorie pour défier un joueur</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => { soundSystem.playClick(); setSelectedCategory(cat.id); }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedCategory === cat.id 
                    ? 'border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/20' 
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <img 
                  src={getAssetPath(`/images/categories/${cat.image}`)}
                  alt={cat.name}
                  className="w-12 h-12 mx-auto rounded-lg object-cover mb-2"
                />
                <span className="text-white text-xs font-semibold">{cat.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Bouton envoyer */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (selectedCategory) {
                soundSystem.playSelect();
                onSend(selectedCategory);
              }
            }}
            disabled={!selectedCategory}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all ${
              selectedCategory 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30' 
                : 'bg-slate-700 opacity-50'
            }`}
          >
            Envoyer le Défi
          </motion.button>

          {/* Partager */}
          <div className="mt-4 text-center">
            <p className="text-white/40 text-xs mb-2">ou partage un lien de défi</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundSystem.playClick();
                if (navigator.share) {
                  navigator.share({
                    title: 'QQUIZ PRODIGY - Défi',
                    text: 'Je te défie sur QQUIZ PRODIGY ! Viens me battre !',
                    url: window.location.origin,
                  });
                } else {
                  navigator.clipboard.writeText(`${window.location.origin} - Je te défie sur QQUIZ PRODIGY !`);
                }
              }}
              className="px-6 py-2 rounded-xl bg-slate-700/50 text-white/60 text-sm font-medium border border-slate-600/30"
            >
              Copier le lien
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChallengeSystem() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    setChallenges(generateMockChallenges());
  }, []);

  const handleAccept = (id: string) => {
    soundSystem.playSelect();
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
      navigate(`/play?category=${challenge.category}&mode=duel`);
    }
  };

  const handleDecline = (id: string) => {
    soundSystem.playClick();
    setChallenges(prev => prev.filter(c => c.id !== id));
  };

  const handleSendChallenge = (category: string) => {
    soundSystem.playNotification();
    setShowCreateModal(false);
    // En mode production, cela enverrait le défi via Supabase
  };

  const pendingChallenges = challenges.filter(c => c.status === 'pending');

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-violet-500/10">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-white/70"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </motion.button>
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            DÉFIS
          </h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['received', 'sent'] as const).map(tab => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundSystem.playClick(); setActiveTab(tab); }}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-white/50 border border-slate-700/30'
              }`}
            >
              {tab === 'received' ? `Reçus (${pendingChallenges.length})` : 'Envoyés'}
            </motion.button>
          ))}
        </div>

        {/* Liste des défis */}
        <AnimatePresence mode="popLayout">
          {activeTab === 'received' && pendingChallenges.length > 0 ? (
            <div className="space-y-3">
              {pendingChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400/50">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="M9 9l6 6M15 9l-6 6"/>
                </svg>
              </div>
              <p className="text-white/40 text-sm">
                {activeTab === 'received' ? 'Aucun défi en attente' : 'Aucun défi envoyé'}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/30"
              >
                Lancer un Défi
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Challenge */}
        <div className="mt-8">
          <h3 className="text-white font-bold text-sm mb-3">Défi Rapide</h3>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundSystem.playSelect();
              navigate('/play?mode=random');
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/20 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">Adversaire Aléatoire</p>
              <p className="text-white/50 text-xs">Trouve un adversaire en quelques secondes</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Modal de création */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateChallengeModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSend={handleSendChallenge}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
