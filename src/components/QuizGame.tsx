/**
 * QQUIZ PRODIGY - Quiz Game Component
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Trophy, Target, Star, Home, Share2, Flame, Volume2, VolumeX } from 'lucide-react';
import { feedService } from '@/lib/feedService';
import { getAssetPath } from '@/lib/assets';
import { useAuth } from '@/contexts/AuthContext';
import { Question, getQuestionsByCategory, getRandomQuestions } from '@/lib/questionsDB';
import { 
  UserProfile, 
  loadUser, 
  saveUser, 
  createNewUser,
  updateUserAfterGame,
  GameResult,
  getLeagueBadge
} from '@/lib/userSystem';
import { calculateAnswerScore, calculateGameSummary, ScoreResult } from '@/lib/scoringSystem';

interface LocationState {
  category?: string;
  categoryName?: string;
  gameMode?: string;
}

// Mapping des catégories vers les backgrounds
const categoryBackgrounds: Record<string, string> = {
  'rap': getAssetPath('/images/questions/bg_rap.png'),
  'football': getAssetPath('/images/questions/bg_football.png'),
  'football-africain': getAssetPath('/images/questions/bg_football.png'),
  'manga': getAssetPath('/images/questions/bg_manga.png'),
  'netflix': getAssetPath('/images/questions/bg_netflix.png'),
  'crypto': getAssetPath('/images/questions/bg_crypto.png'),
  'kpop': getAssetPath('/images/questions/bg_kpop.png'),
  'afrobeats': getAssetPath('/images/questions/bg_afrobeats.png'),
  'nba': getAssetPath('/images/questions/bg_nba.png'),
  'marvel': getAssetPath('/images/questions/bg_marvel.png'),
  'gaming': getAssetPath('/images/questions/bg_gaming.png'),
  'gaming-pro': getAssetPath('/images/questions/bg_gaming.png'),
  'tiktok': getAssetPath('/images/questions/bg_tiktok.png'),
  'afrique': getAssetPath('/images/questions/bg_afrique.png'),
  'youtube': getAssetPath('/images/questions/bg_youtube.png'),
  'mode': getAssetPath('/images/questions/bg_mode.png'),
  'celebrites': getAssetPath('/images/questions/bg_celebrites.png'),
};

export default function QuizGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, categoryName, gameMode } = (location.state as LocationState) || {};

  const [gameState, setGameState] = useState<'loading' | 'playing' | 'result'>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [xpGained, setXpGained] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [startTime] = useState(Date.now());
  const [shared, setShared] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { user: authUser } = useAuth();

  const timePerQuestion = gameMode === 'solo' ? 20 : 15;
  const questionsCount = 10;

  // Background dynamique basé sur la catégorie
  const backgroundImage = useMemo(() => {
    if (!category) return null;
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    return categoryBackgrounds[normalizedCategory] || null;
  }, [category]);

  // Charger l'utilisateur et les questions
  useEffect(() => {
    let currentUser = loadUser();
    if (!currentUser) {
      currentUser = createNewUser('Joueur' + Math.floor(Math.random() * 10000));
      saveUser(currentUser);
    }
    setUser(currentUser);

    // Charger les questions
    const loadedQuestions = category 
      ? getRandomQuestions(category, questionsCount)
      : getRandomQuestions('sport', questionsCount);
    
    setQuestions(loadedQuestions);
    setTimeLeft(timePerQuestion);
    setGameState('playing');
  }, [category, questionsCount, timePerQuestion]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1);
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showFeedback, timePerQuestion]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showFeedback || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion?.correct;

    if (isCorrect) {
      // Nouveau système de scoring style QuizUp (max ~20 points par question)
      const scoreResult = calculateAnswerScore(
        true,
        currentQuestion.difficulty,
        timeLeft,
        streak + 1
      );
      
      setScore((prev) => prev + scoreResult.totalPoints);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCombo((prev) => Math.min(prev + 0.5, 3));
    } else {
      setStreak(0);
      setCombo(1);
    }

    // Passer à la question suivante
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(timePerQuestion);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Fin de la partie
        finishGame(isCorrect);
      }
    }, 1500);
  }, [showFeedback, selectedAnswer, questions, currentIndex, timeLeft, combo, timePerQuestion]);

  const finishGame = (lastAnswerCorrect: boolean) => {
    const finalCorrectCount = correctCount + (lastAnswerCorrect ? 1 : 0);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isWin = finalCorrectCount >= questions.length / 2;

    const gameResult: GameResult = {
      category: categoryName || 'Général',
      score,
      correctAnswers: finalCorrectCount,
      totalQuestions: questions.length,
      timeSpent,
      isWin,
      isDuel: gameMode === 'random' || gameMode === 'ranked'
    };

    if (user) {
      const previousLevel = user.level;
      const updatedUser = updateUserAfterGame(user, gameResult);
      
      // Calculer XP gagné
      const xp = updatedUser.totalXp - user.totalXp;
      setXpGained(xp);
      
      // Vérifier level up
      if (updatedUser.level > previousLevel) {
        setLevelUp(true);
      }

      saveUser(updatedUser);
      setUser(updatedUser);
    }

    setGameState('result');

    // Partager automatiquement le resultat sur le feed
    if (authUser) {
      try {
        feedService.postQuizResult(
          authUser.id,
          categoryName || category || 'General',
          score,
          isWin,
          undefined,
          undefined
        );
      } catch (error) {
        console.error('Erreur partage resultat:', error);
      }
    }
  };

  const currentQuestion = questions[currentIndex];

  // Loading
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center safe-area-inset">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-4"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-cyan-500 border-l-transparent animate-spin" />
            <img 
              src={getAssetPath('/images/logo/Logo_Principal_Neon.png')} 
              alt="Loading"
              className="absolute inset-2 w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Chargement...</h3>
          <p className="text-white/60 text-sm sm:text-base">{categoryName || 'Quiz Général'}</p>
        </motion.div>
      </div>
    );
  }

  // Result Screen
  if (gameState === 'result') {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const grade = percentage >= 80 ? 'S' : percentage >= 60 ? 'A' : percentage >= 40 ? 'B' : 'C';
    const gradeColors: Record<string, string> = {
      'S': 'from-yellow-400 to-orange-500',
      'A': 'from-green-400 to-emerald-500',
      'B': 'from-blue-400 to-cyan-500',
      'C': 'from-gray-400 to-gray-500'
    };
    const gradeMessages: Record<string, string> = {
      'S': 'LÉGENDAIRE !',
      'A': 'EXCELLENT !',
      'B': 'BIEN JOUÉ !',
      'C': 'Continue !'
    };

    return (
      <div 
        className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 safe-area-inset relative overflow-hidden"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-purple-950/80 to-slate-950/90" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full relative z-10"
        >
          {/* Level Up Animation */}
          {levelUp && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 sm:mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black font-bold text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                NIVEAU {user?.level} ATTEINT !
              </div>
            </motion.div>
          )}

          {/* Grade */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br ${gradeColors[grade]} flex items-center justify-center shadow-2xl`}
          >
            <span className="text-5xl sm:text-6xl font-black text-white">{grade}</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{gradeMessages[grade]}</h2>
          <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">{categoryName || 'Quiz Général'}</p>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10"
          >
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
              {score.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm sm:text-base">POINTS</div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10"
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-white">{correctCount}/{questions.length}</div>
              <div className="text-white/50 text-xs">Correct</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-white">{percentage}%</div>
              <div className="text-white/50 text-xs">Précision</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-white">+{xpGained}</div>
              <div className="text-white/50 text-xs">XP</div>
            </motion.div>
          </div>

          {/* User Progress */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center font-bold text-white text-sm sm:text-base`}>
                    {user.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium text-sm sm:text-base">{user.username}</div>
                    <div className="text-white/50 text-xs sm:text-sm">Niveau {user.level}</div>
                  </div>
                </div>
                <img 
                  src={getLeagueBadge(user.league)}
                  alt={user.league}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                />
              </div>
              <div className="text-white/50 text-xs mt-1 text-right">
                {user.xp}/{user.xpToNextLevel} XP
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGameState('loading');
                setCurrentIndex(0);
                setScore(0);
                setCorrectCount(0);
                setStreak(0);
                setCombo(1);
                setSelectedAnswer(null);
                setShowFeedback(false);
                const newQuestions = category 
                  ? getRandomQuestions(category, questionsCount)
                  : getRandomQuestions('sport', questionsCount);
                setQuestions(newQuestions);
                setTimeLeft(timePerQuestion);
                setTimeout(() => setGameState('playing'), 500);
              }}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-bold shadow-lg shadow-violet-500/50 text-sm sm:text-base"
            >
              REJOUER
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-white/10 rounded-xl text-white font-bold border border-white/20"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShared(true);
                const text = `J'ai obtenu ${score} points en ${categoryName || 'Quiz'} sur QQUIZ PRODIGY ! ${percentage}% de bonnes reponses. Tu peux faire mieux ?`;
                if (navigator.share) {
                  navigator.share({ title: 'QQUIZ PRODIGY', text, url: 'https://qquizz-mvp1.vercel.app' });
                } else {
                  navigator.clipboard.writeText(text + ' https://qquizz-mvp1.vercel.app');
                }
              }}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white font-bold ${shared ? 'bg-green-500/20 border border-green-500/50' : 'bg-cyan-500/20 border border-cyan-500/50'}`}
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex flex-col safe-area-inset relative overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-purple-950/70 to-slate-950/80" />
      
      {/* Contenu */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="text-white/50 hover:text-white transition-colors p-2 -m-2"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-white font-bold text-sm sm:text-base">
              {currentIndex + 1}/{questions.length}
            </div>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-xs sm:text-sm font-bold flex items-center gap-1"
              >
                <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
                {streak}x
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              {score.toLocaleString()}
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white/50 hover:text-white transition-colors p-1"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="px-3 sm:px-4">
          <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / timePerQuestion) * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                timeLeft > 10 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                timeLeft > 5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
            />
          </div>
          <div className="text-center mt-1 sm:mt-2">
            <span className={`text-xl sm:text-2xl font-bold ${
              timeLeft > 10 ? 'text-green-400' :
              timeLeft > 5 ? 'text-yellow-400' :
              'text-red-400 animate-pulse'
            }`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center p-3 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="mb-4 sm:mb-8"
            >
              <div className="text-center mb-3 sm:mb-4 flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-cyan-400 text-xs sm:text-sm font-medium">
                  {currentQuestion?.category}
                </span>
                {currentQuestion?.difficulty === 'hard' && (
                  <span className="px-2 sm:px-3 py-1 bg-red-500/20 backdrop-blur-md rounded-full text-red-400 text-xs font-bold">
                    DIFFICILE
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white text-center leading-tight px-2">
                {currentQuestion?.question}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl mx-auto w-full">
            {currentQuestion?.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct;
              const showCorrect = showFeedback && isCorrect;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl text-left font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 backdrop-blur-md touch-manipulation ${
                    showCorrect
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                      : showWrong
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                      : isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30 border border-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                      showCorrect || showWrong ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="line-clamp-2">{answer}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-4 sm:mt-8"
              >
                {selectedAnswer === currentQuestion?.correct ? (
                  <div className="text-green-400 font-bold text-lg sm:text-xl">
                    +{Math.floor((currentQuestion.points + timeLeft * 10) * combo)} points
                  </div>
                ) : (
                  <div className="text-red-400 font-bold text-lg sm:text-xl">
                    Mauvaise réponse
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Combo indicator */}
        {combo > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-20 sm:bottom-4 right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold shadow-lg text-sm sm:text-base"
          >
            COMBO x{combo.toFixed(1)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
