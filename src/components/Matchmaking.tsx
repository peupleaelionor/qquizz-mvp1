import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { matchmakingService, gameService, supabase } from '@/lib/supabase';
import { getRandomQuestions } from '@/lib/questionsDB';
import { Search, X, Users, Zap, Clock, Trophy } from 'lucide-react';

interface MatchmakingProps {
  mode: 'random' | 'ranked';
  category?: string;
  onCancel: () => void;
  onMatchFound: (gameId: string, opponentName: string) => void;
}

export default function Matchmaking({ mode, category, onCancel, onMatchFound }: MatchmakingProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'searching' | 'found' | 'connecting'>('searching');
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState<any>(null);
  const [dots, setDots] = useState('');

  // Animation des points
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Timer de recherche
  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Logique de matchmaking
  useEffect(() => {
    if (!user || !profile) return;

    let subscription: any;
    let searchInterval: any;

    const startMatchmaking = async () => {
      try {
        // Rejoindre la file d'attente
        await matchmakingService.joinQueue(
          user.id,
          mode,
          category,
          profile.league_points || 1000
        );

        // Chercher un adversaire toutes les 2 secondes
        searchInterval = setInterval(async () => {
          const opponent = await matchmakingService.findOpponent(
            user.id,
            mode,
            profile.league_points || 1000
          );

          if (opponent) {
            clearInterval(searchInterval);
            setStatus('found');
            
            // Récupérer le profil de l'adversaire
            const { data: opponentProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', opponent.user_id)
              .single();
            
            setOpponent(opponentProfile);

            // Créer la partie
            const questions = getRandomQuestions(category || 'culture', 10);
            const game = await gameService.createSoloGame(user.id, category || 'culture', questions);

            // Supprimer les deux joueurs de la file
            await matchmakingService.leaveQueue(user.id);
            await matchmakingService.leaveQueue(opponent.user_id);

            // Attendre 2 secondes pour l'animation
            setTimeout(() => {
              setStatus('connecting');
              setTimeout(() => {
                onMatchFound(game.id, opponentProfile?.username || 'Adversaire');
              }, 1500);
            }, 2000);
          }
        }, 2000);

        // S'abonner aux changements en temps réel
        subscription = matchmakingService.subscribeToQueue((payload) => {
          console.log('Queue update:', payload);
        });

      } catch (error) {
        console.error('Erreur matchmaking:', error);
      }
    };

    startMatchmaking();

    // Cleanup
    return () => {
      if (searchInterval) clearInterval(searchInterval);
      if (subscription) subscription.unsubscribe();
      matchmakingService.leaveQueue(user.id);
    };
  }, [user, profile, mode, category]);

  const handleCancel = async () => {
    if (user) {
      await matchmakingService.leaveQueue(user.id);
    }
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900/80 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <AnimatePresence mode="wait">
          {status === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Searching animation */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-purple-500"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-4 border-transparent border-b-cyan-400 border-l-purple-400"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-12 h-12 text-cyan-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Recherche d'adversaire{dots}
              </h2>
              
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                <Clock className="w-4 h-4" />
                <span>{formatTime(searchTime)}</span>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Mode</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    {mode === 'ranked' ? (
                      <>
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        Classé
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 text-cyan-400" />
                        Aléatoire
                      </>
                    )}
                  </span>
                </div>
                {category && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">Catégorie</span>
                    <span className="text-white font-semibold capitalize">{category}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </motion.div>
          )}

          {status === 'found' && opponent && (
            <motion.div
              key="found"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Adversaire trouvé !
              </h2>

              <div className="flex items-center justify-center gap-8 mb-6">
                {/* Player */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile?.avatar_color || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-white font-bold text-xl mb-2`}>
                    {profile?.username?.substring(0, 2).toUpperCase() || 'ME'}
                  </div>
                  <p className="text-white font-semibold">{profile?.username || 'Toi'}</p>
                  <p className="text-gray-400 text-sm">Niv. {profile?.level || 1}</p>
                </div>

                <div className="text-3xl font-bold text-gray-500">VS</div>

                {/* Opponent */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${opponent.avatar_color || 'from-red-500 to-orange-600'} flex items-center justify-center text-white font-bold text-xl mb-2`}>
                    {opponent.username?.substring(0, 2).toUpperCase() || 'OP'}
                  </div>
                  <p className="text-white font-semibold">{opponent.username}</p>
                  <p className="text-gray-400 text-sm">Niv. {opponent.level || 1}</p>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Connexion en cours{dots}
              </h2>
              <p className="text-gray-400">Préparation de la partie</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
