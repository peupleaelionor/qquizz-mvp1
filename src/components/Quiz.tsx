import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Base de questions QQUIZ PRODIGY
const QUESTIONS_DB = [
  {
    id: 1,
    category: "Culture Générale",
    question: "Quelle est la capitale de la République Démocratique du Congo ?",
    answers: ["Kinshasa", "Brazzaville", "Lubumbashi", "Goma"],
    correct: 0,
    difficulty: "Facile",
    points: 100
  },
  {
    id: 2,
    category: "Sport",
    question: "Quel pays a remporté la Coupe du Monde de Football 2022 ?",
    answers: ["France", "Argentine", "Brésil", "Allemagne"],
    correct: 1,
    difficulty: "Facile",
    points: 100
  },
  {
    id: 3,
    category: "Science",
    question: "Quelle planète est surnommée la 'planète rouge' ?",
    answers: ["Vénus", "Jupiter", "Mars", "Saturne"],
    correct: 2,
    difficulty: "Facile",
    points: 100
  },
  {
    id: 4,
    category: "Histoire",
    question: "En quelle année l'indépendance du Congo a-t-elle été proclamée ?",
    answers: ["1958", "1960", "1962", "1965"],
    correct: 1,
    difficulty: "Moyen",
    points: 150
  },
  {
    id: 5,
    category: "Musique",
    question: "Qui est considéré comme le 'Roi de la Rumba Congolaise' ?",
    answers: ["Papa Wemba", "Franco Luambo", "Koffi Olomide", "Fally Ipupa"],
    correct: 1,
    difficulty: "Moyen",
    points: 150
  },
  {
    id: 6,
    category: "Géographie",
    question: "Quel est le plus long fleuve d'Afrique ?",
    answers: ["Congo", "Niger", "Nil", "Zambèze"],
    correct: 2,
    difficulty: "Facile",
    points: 100
  },
  {
    id: 7,
    category: "Cinéma",
    question: "Quel film a remporté l'Oscar du meilleur film en 2024 ?",
    answers: ["Oppenheimer", "Barbie", "Killers of the Flower Moon", "Poor Things"],
    correct: 0,
    difficulty: "Moyen",
    points: 150
  },
  {
    id: 8,
    category: "Technologie",
    question: "Quelle entreprise a créé l'iPhone ?",
    answers: ["Samsung", "Google", "Apple", "Microsoft"],
    correct: 2,
    difficulty: "Facile",
    points: 100
  },
  {
    id: 9,
    category: "Sport",
    question: "Combien de joueurs composent une équipe de basketball sur le terrain ?",
    answers: ["4", "5", "6", "7"],
    correct: 1,
    difficulty: "Facile",
    points: 100
  },
  {
    id: 10,
    category: "Culture Générale",
    question: "Quelle est la monnaie officielle de la RDC ?",
    answers: ["Dollar", "Euro", "Franc Congolais", "CFA"],
    correct: 2,
    difficulty: "Facile",
    points: 100
  }
];

interface QuizProps {
  onComplete?: (score: number, correctAnswers: number, totalQuestions: number) => void;
  questionsCount?: number;
  timePerQuestion?: number;
}

export default function Quiz({ 
  onComplete, 
  questionsCount = 5,
  timePerQuestion = 15 
}: QuizProps) {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'result'>('waiting');
  const [questions, setQuestions] = useState<typeof QUESTIONS_DB>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1);

  // Sélectionner des questions aléatoires
  const initGame = useCallback(() => {
    const shuffled = [...QUESTIONS_DB].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, questionsCount));
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(timePerQuestion);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
    setCombo(1);
    setGameState('playing');
  }, [questionsCount, timePerQuestion]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Temps écoulé
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showResult, timePerQuestion]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion.correct;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10);
      const comboBonus = combo;
      const totalPoints = (currentQuestion.points + timeBonus) * comboBonus;
      
      setScore((prev) => prev + totalPoints);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCombo((prev) => Math.min(prev + 0.5, 3));
    } else {
      setStreak(0);
      setCombo(1);
    }

    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(timePerQuestion);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameState('result');
        onComplete?.(score, correctCount + (isCorrect ? 1 : 0), questions.length);
      }
    }, 2000);
  };

  const currentQuestion = questions[currentIndex];

  // Écran d'attente
  if (gameState === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.5)",
                "0 0 60px rgba(139, 92, 246, 0.8)",
                "0 0 20px rgba(139, 92, 246, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-40 h-40 mx-auto mb-8 rounded-2xl overflow-hidden"
          >
            <img 
              src="/images/Logo_Principal_Neon.png" 
              alt="QQUIZ PRODIGY" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <h1 className="text-4xl font-black text-white mb-4">
            QQUIZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">PRODIGY</span>
          </h1>
          
          <p className="text-gray-400 mb-8">
            {questionsCount} questions - {timePerQuestion}s par question
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initGame}
            className="px-12 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white font-bold text-xl shadow-lg shadow-violet-500/50 hover:shadow-violet-500/80 transition-shadow"
          >
            JOUER
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Écran de résultat
  if (gameState === 'result') {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const grade = percentage >= 80 ? 'S' : percentage >= 60 ? 'A' : percentage >= 40 ? 'B' : 'C';
    const gradeColors: Record<string, string> = {
      'S': 'from-yellow-400 to-orange-500',
      'A': 'from-green-400 to-emerald-500',
      'B': 'from-blue-400 to-cyan-500',
      'C': 'from-gray-400 to-gray-500'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${gradeColors[grade]} flex items-center justify-center shadow-2xl`}
          >
            <span className="text-6xl font-black text-white">{grade}</span>
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-2">PARTIE TERMINÉE</h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10"
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
              {score.toLocaleString()}
            </div>
            <div className="text-gray-400">POINTS</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="text-2xl font-bold text-green-400">{correctCount}/{questions.length}</div>
              <div className="text-gray-400 text-sm">Bonnes réponses</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="text-2xl font-bold text-cyan-400">{percentage}%</div>
              <div className="text-gray-400 text-sm">Précision</div>
            </motion.div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={initGame}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-bold shadow-lg shadow-violet-500/50"
            >
              REJOUER
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('waiting')}
              className="flex-1 px-6 py-4 bg-white/10 rounded-xl text-white font-bold border border-white/20"
            >
              MENU
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Écran de jeu
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-white font-bold">
            {currentIndex + 1}/{questions.length}
          </div>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-sm font-bold"
            >
              {streak}x STREAK
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
            'text-red-400'
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
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
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
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mt-8"
            >
              {selectedAnswer === currentQuestion?.correct ? (
                <div className="text-green-400 font-bold text-xl">
                  +{currentQuestion.points + Math.floor(timeLeft * 10)} points
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
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-20 right-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-bold shadow-lg"
        >
          x{combo.toFixed(1)} COMBO
        </motion.div>
      )}
    </div>
  );
}
