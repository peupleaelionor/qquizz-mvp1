import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Trophy, Target, Star, Home } from 'lucide-react';
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

interface LocationState {
  category?: string;
  categoryName?: string;
  gameMode?: string;
}

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

  const timePerQuestion = gameMode === 'solo' ? 20 : 15;
  const questionsCount = 10;

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
      const timeBonus = Math.floor(timeLeft * 10);
      const comboMultiplier = combo;
      const totalPoints = Math.floor((currentQuestion.points + timeBonus) * comboMultiplier);
      
      setScore((prev) => prev + totalPoints);
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
  };

  const currentQuestion = questions[currentIndex];

  // Loading
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-cyan-500 border-l-transparent animate-spin" />
            <img 
              src="/images/logo/Logo_Principal_Neon.png" 
              alt="Loading"
              className="absolute inset-2 w-20 h-20 object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Chargement...</h3>
          <p className="text-white/60">{categoryName || 'Quiz Général'}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          {/* Level Up Animation */}
          {levelUp && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black font-bold">
                <Star className="w-5 h-5" />
                NIVEAU {user?.level} ATTEINT !
              </div>
            </motion.div>
          )}

          {/* Grade */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${gradeColors[grade]} flex items-center justify-center shadow-2xl`}
          >
            <span className="text-6xl font-black text-white">{grade}</span>
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-2">{gradeMessages[grade]}</h2>
          <p className="text-white/60 mb-6">{categoryName || 'Quiz Général'}</p>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10"
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
              {score.toLocaleString()}
            </div>
            <div className="text-white/60">POINTS</div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">{correctCount}/{questions.length}</div>
              <div className="text-white/50 text-xs">Correct</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <Trophy className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">{percentage}%</div>
              <div className="text-white/50 text-xs">Précision</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">+{xpGained}</div>
              <div className="text-white/50 text-xs">XP</div>
            </motion.div>
          </div>

          {/* User Progress */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center font-bold text-white`}>
                    {user.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium">{user.username}</div>
                    <div className="text-white/50 text-sm">Niveau {user.level}</div>
                  </div>
                </div>
                <img 
                  src={getLeagueBadge(user.league)}
                  alt={user.league}
                  className="w-10 h-10 object-contain"
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
          <div className="flex gap-4">
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
              className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-bold shadow-lg shadow-violet-500/50"
            >
              REJOUER
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-4 bg-white/10 rounded-xl text-white font-bold border border-white/20"
            >
              <Home className="w-5 h-5 mx-auto" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="text-white font-bold">
            {currentIndex + 1}/{questions.length}
          </div>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-sm font-bold flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              {streak}x
            </motion.div>
          )}
        </div>
        
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
          {score.toLocaleString()}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="px-4">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
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
        <div className="text-center mt-2">
          <span className={`text-2xl font-bold ${
            timeLeft > 10 ? 'text-green-400' :
            timeLeft > 5 ? 'text-yellow-400' :
            'text-red-400 animate-pulse'
          }`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="mb-8"
          >
            <div className="text-center mb-4">
              <span className="px-4 py-2 bg-white/10 rounded-full text-cyan-400 text-sm font-medium">
                {currentQuestion?.category}
              </span>
              {currentQuestion?.difficulty === 'hard' && (
                <span className="ml-2 px-3 py-1 bg-red-500/20 rounded-full text-red-400 text-xs font-bold">
                  DIFFICILE
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center leading-tight">
              {currentQuestion?.question}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
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
                className={`p-4 md:p-6 rounded-2xl text-left font-semibold text-lg transition-all duration-300 ${
                  showCorrect
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                    : showWrong
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                    : isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showCorrect || showWrong ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {answer}
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
              className="text-center mt-8"
            >
              {selectedAnswer === currentQuestion?.correct ? (
                <div className="text-green-400 font-bold text-xl">
                  +{Math.floor((currentQuestion.points + timeLeft * 10) * combo)} points
                </div>
              ) : (
                <div className="text-red-400 font-bold text-xl">
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
          className="fixed bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold shadow-lg"
        >
          COMBO x{combo.toFixed(1)}
        </motion.div>
      )}
    </div>
  );
}
