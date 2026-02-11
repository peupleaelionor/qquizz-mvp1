import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DramaBarProps {
  playerScore: number;
  opponentScore: number;
  questionIndex: number;
  totalQuestions: number;
  isLastAnswer?: boolean;
  playerFastAnswer?: boolean;
  soundEnabled?: boolean;
}

export default function DramaBar({
  playerScore,
  opponentScore,
  questionIndex,
  totalQuestions,
  isLastAnswer = false,
  playerFastAnswer = false,
  soundEnabled = true
}: DramaBarProps) {
  const [displayPlayerPercent, setDisplayPlayerPercent] = useState(50);
  const [displayOpponentPercent, setDisplayOpponentPercent] = useState(50);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

  // Play sound
  const playSound = (type: 'tick' | 'grave' | 'accent') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'tick') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } else if (type === 'grave') {
      oscillator.frequency.value = 120;
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } else if (type === 'accent') {
      oscillator.frequency.value = 1200;
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.22);
    }
  };

  useEffect(() => {
    const totalScore = playerScore + opponentScore;
    if (totalScore === 0) {
      setDisplayPlayerPercent(50);
      setDisplayOpponentPercent(50);
      return;
    }

    let playerPercent = (playerScore / totalScore) * 100;
    let opponentPercent = (opponentScore / totalScore) * 100;

    // Tension amplifiée sur les 2 dernières questions
    const tensionMultiplier = questionIndex >= totalQuestions - 2 ? 1.8 : 1.0;
    
    // Faux équilibre contrôlé
    if (Math.abs(playerPercent - opponentPercent) < 15) {
      const leader = playerPercent > opponentPercent ? 'player' : 'opponent';
      if (leader === 'player') {
        playerPercent *= 0.85;
        opponentPercent *= 1.15;
      } else {
        playerPercent *= 1.15;
        opponentPercent *= 0.85;
      }
    }

    // Renversement scénarisé
    if (isLastAnswer && playerPercent < opponentPercent && playerFastAnswer) {
      const delta = opponentPercent - playerPercent;
      playerPercent += delta * 1.2;
      opponentPercent -= delta * 0.5;
      playSound('accent');
    }

    // Apply tension
    playerPercent *= tensionMultiplier;
    opponentPercent *= tensionMultiplier;

    // Normalize
    const total = playerPercent + opponentPercent;
    playerPercent = (playerPercent / total) * 100;
    opponentPercent = (opponentPercent / total) * 100;

    // Micro-sauts + glide
    const snapDuration = questionIndex === totalQuestions - 1 ? 90 : 120;
    const glideDuration = questionIndex === totalQuestions - 1 ? 520 : 420;

    setTimeout(() => {
      setDisplayPlayerPercent(playerPercent);
      setDisplayOpponentPercent(opponentPercent);
      playSound(playerScore > opponentScore ? 'tick' : 'grave');
    }, snapDuration);

    setTimeout(() => {
      setDisplayPlayerPercent(playerPercent);
      setDisplayOpponentPercent(opponentPercent);
    }, snapDuration + glideDuration);

  }, [playerScore, opponentScore, questionIndex, totalQuestions, isLastAnswer, playerFastAnswer]);

  // Couleurs narratives
  const gap = Math.abs(displayPlayerPercent - displayOpponentPercent);
  const playerLeading = displayPlayerPercent > displayOpponentPercent;
  
  let playerColor = 'from-violet-500 to-violet-600';
  let opponentColor = 'from-cyan-500 to-cyan-600';
  
  if (gap < 5) {
    playerColor = 'from-violet-500 to-violet-600';
    opponentColor = 'from-violet-500 to-violet-600';
  } else if (gap < 25) {
    playerColor = playerLeading ? 'from-cyan-400 to-cyan-500' : 'from-violet-500 to-violet-600';
    opponentColor = !playerLeading ? 'from-cyan-400 to-cyan-500' : 'from-violet-500 to-violet-600';
  } else {
    playerColor = playerLeading ? 'from-green-400 to-green-500' : 'from-red-500 to-red-600 animate-pulse';
    opponentColor = !playerLeading ? 'from-green-400 to-green-500' : 'from-red-500 to-red-600 animate-pulse';
  }

  return (
    <div className="px-3 sm:px-4 py-3">
      <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
        {/* Player bar */}
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${displayPlayerPercent}%` }}
          transition={{ 
            duration: questionIndex === totalQuestions - 1 ? 0.52 : 0.42,
            ease: [0.2, 0.8, 0.2, 1]
          }}
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${playerColor} shadow-lg`}
        />
        
        {/* Opponent bar */}
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${displayOpponentPercent}%` }}
          transition={{ 
            duration: questionIndex === totalQuestions - 1 ? 0.52 : 0.42,
            ease: [0.2, 0.8, 0.2, 1]
          }}
          className={`absolute right-0 top-0 h-full bg-gradient-to-l ${opponentColor} shadow-lg`}
        />
        
        {/* Center divider */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/20 -translate-x-1/2" />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-1.5 text-xs font-medium">
        <span className={`${playerLeading ? 'text-cyan-400' : 'text-white/50'}`}>Toi</span>
        <span className={`${!playerLeading ? 'text-cyan-400' : 'text-white/50'}`}>Adversaire</span>
      </div>
    </div>
  );
}
