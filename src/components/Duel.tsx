import { useState, useEffect } from 'react';
import { Trophy, Clock, Zap, Target } from 'lucide-react';

interface DuelPlayer {
  id: string;
  username: string;
  avatar: string;
  level: number;
  score: number;
  correctAnswers: number;
  isReady: boolean;
}

interface DuelQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export default function Duel() {
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'playing' | 'finished'>('waiting');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);

  const [players, setPlayers] = useState<DuelPlayer[]>([
    {
      id: 'player1',
      username: 'Toi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      level: 25,
      score: 0,
      correctAnswers: 0,
      isReady: true
    },
    {
      id: 'player2',
      username: 'ProGamer243',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer243',
      level: 45,
      score: 0,
      correctAnswers: 0,
      isReady: true
    }
  ]);

  const questions: DuelQuestion[] = [
    {
      id: '1',
      question: 'Quelle est la capitale de la RDC ?',
      options: ['Brazzaville', 'Kinshasa', 'Lubumbashi', 'Goma'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      id: '2',
      question: 'En quelle année le Congo a-t-il obtenu son indépendance ?',
      options: ['1958', '1960', '1962', '1965'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      id: '3',
      question: 'Quel est le plus long fleuve d\'Afrique ?',
      options: ['Le Congo', 'Le Niger', 'Le Nil', 'Le Zambèze'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  // Countdown avant le début
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTimeLeft(currentQuestion.timeLimit);
    }
  }, [gameState, countdown, currentQuestion]);

  // Timer de question
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);

    // Simuler la réponse de l'adversaire
    setTimeout(() => {
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      const points = isCorrect ? timeLeft * 10 : 0;

      setPlayers(players.map((p, i) => {
        if (i === 0) {
          return {
            ...p,
            score: p.score + points,
            correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0)
          };
        } else {
          // Adversaire répond aléatoirement
          const opponentCorrect = Math.random() > 0.3;
          const opponentPoints = opponentCorrect ? (timeLeft - 2) * 10 : 0;
          return {
            ...p,
            score: p.score + opponentPoints,
            correctAnswers: p.correctAnswers + (opponentCorrect ? 1 : 0)
          };
        }
      }));

      setTimeout(handleNextQuestion, 2000);
    }, 500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
      setSelectedAnswer(null);
    } else {
      setGameState('finished');
    }
  };

  const getWinner = () => {
    const [player1, player2] = players;
    if (player1.score > player2.score) return player1;
    if (player2.score > player1.score) return player2;
    return null;
  };

  if (gameState === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Duel 1v1</h1>
          <p className="text-gray-400">Affronte ton adversaire en temps réel !</p>
        </div>

        <div className="flex gap-8 mb-12">
          {players.map((player) => (
            <div key={player.id} className="text-center">
              <img
                src={player.avatar}
                alt={player.username}
                className="w-32 h-32 rounded-full border-4 border-purple-500 mb-4"
              />
              <h3 className="text-xl font-bold text-white">{player.username}</h3>
              <p className="text-purple-400">Niveau {player.level}</p>
              {player.isReady && (
                <div className="mt-2 text-green-400 font-semibold">✓ Prêt</div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 rounded-xl transition-all transform hover:scale-105"
        >
          Commencer le Duel !
        </button>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">
            {countdown}
          </div>
          <p className="text-2xl text-white mt-4">Prépare-toi...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const winner = getWinner();
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
        <Trophy className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
        
        <h1 className="text-4xl font-bold text-white mb-8">
          {winner ? `${winner.username} gagne !` : 'Match Nul !'}
        </h1>

        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mb-8">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border-2 ${
                winner?.id === player.id ? 'border-yellow-400' : 'border-purple-500/20'
              }`}
            >
              <img
                src={player.avatar}
                alt={player.username}
                className="w-20 h-20 rounded-full border-2 border-purple-500 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white text-center mb-4">
                {player.username}
              </h3>
              <div className="space-y-2 text-center">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Score:</span>
                  <span className="text-2xl font-bold text-purple-400">{player.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bonnes réponses:</span>
                  <span className="text-xl font-bold text-green-400">
                    {player.correctAnswers}/{questions.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 rounded-xl transition-all"
        >
          Rejouer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header avec scores */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-purple-500/20 p-4">
        <div className="flex justify-between items-center mb-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <img
                src={player.avatar}
                alt={player.username}
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <div>
                <h3 className="font-bold text-white">{player.username}</h3>
                <p className="text-2xl font-bold text-purple-400">{player.score}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Clock className="w-5 h-5 text-purple-400" />
          <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-1000"
              style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
            ></div>
          </div>
          <span className="text-xl font-bold text-white w-12 text-center">{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="mb-8 text-center">
          <div className="text-sm text-purple-400 mb-2">
            Question {currentQuestionIndex + 1} / {questions.length}
          </div>
          <h2 className="text-3xl font-bold text-white">{currentQuestion.question}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-600 text-white border-2 border-green-400'
                      : isSelected
                      ? 'bg-red-600 text-white border-2 border-red-400'
                      : 'bg-gray-700 text-gray-400'
                    : 'bg-gray-800 text-white hover:bg-gray-700 border-2 border-purple-500/20 hover:border-purple-500'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
