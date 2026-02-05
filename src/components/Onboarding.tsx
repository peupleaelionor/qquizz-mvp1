/**
 * QQUIZ PRODIGY - Onboarding Component
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Zap, Target, ChevronRight, ChevronLeft, 
  Gamepad2, Crown, Star, Flame, Globe, Sparkles 
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "Bienvenue sur QQUIZ PRODIGY",
    subtitle: "Le quiz qui te rend accro",
    description: "Défie tes amis, grimpe les classements et deviens une légende du quiz !",
    icon: Sparkles,
    gradient: "from-violet-600 to-fuchsia-600",
    image: "/images/logo/Logo_Principal_Neon.png"
  },
  {
    id: 2,
    title: "20+ Catégories",
    subtitle: "RAP, Football, Netflix, Manga...",
    description: "Des questions sur tous les sujets tendance. Trouve ta spécialité et domine !",
    icon: Gamepad2,
    gradient: "from-cyan-500 to-blue-600",
    features: ["RAP & Hip-Hop", "Football Africain", "K-POP", "Manga & Anime", "Netflix & Séries"]
  },
  {
    id: 3,
    title: "Affronte le Monde",
    subtitle: "Matchmaking en temps réel",
    description: "Trouve un adversaire en quelques secondes et prouve que tu es le meilleur !",
    icon: Globe,
    gradient: "from-orange-500 to-red-600",
    features: ["Mode Solo", "Duel 1v1", "Classé", "Tournois"]
  },
  {
    id: 4,
    title: "Gagne des Récompenses",
    subtitle: "XP, Niveaux, Badges",
    description: "Chaque partie te rapproche du sommet. Débloque des achievements exclusifs !",
    icon: Crown,
    gradient: "from-yellow-500 to-orange-500",
    features: ["Système de niveaux", "6 Ligues à gravir", "Badges exclusifs", "Classement mondial"]
  },
  {
    id: 5,
    title: "Prêt à jouer ?",
    subtitle: "Ton aventure commence maintenant",
    description: "Choisis un pseudo et lance-toi dans l'arène !",
    icon: Flame,
    gradient: "from-green-500 to-emerald-600",
    isLast: true
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [username, setUsername] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || currentSlide === 0) return;
    setIsAnimating(true);
    setCurrentSlide(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleComplete = () => {
    if (username.trim().length >= 3) {
      localStorage.setItem('qquiz_username', username.trim());
      localStorage.setItem('qquiz_onboarding_complete', 'true');
      onComplete();
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('qquiz_onboarding_complete', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={skipOnboarding}
          className="text-white/50 hover:text-white text-sm font-medium px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
        >
          Passer
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-gradient-to-r from-cyan-400 to-fuchsia-400' 
                : index < currentSlide
                ? 'w-2 bg-white/50'
                : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-md w-full text-center"
          >
            {/* Icon/Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              {slide.image ? (
                <img 
                  src={slide.image} 
                  alt="QQUIZ PRODIGY"
                  className="w-32 h-32 mx-auto object-contain"
                />
              ) : (
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-2xl`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-black text-white mb-2"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-lg font-semibold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent mb-4`}
            >
              {slide.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 mb-8 text-base sm:text-lg"
            >
              {slide.description}
            </motion.p>

            {/* Features list */}
            {slide.features && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-2 mb-8"
              >
                {slide.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Username input on last slide */}
            {slide.isLast && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ton pseudo..."
                  maxLength={20}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-lg font-medium placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <p className="text-white/40 text-sm mt-2">
                  Minimum 3 caractères
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8 flex items-center justify-between">
        {/* Back button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`p-4 rounded-full transition-all ${
            currentSlide === 0 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next/Start button */}
        {slide.isLast ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={username.trim().length < 3}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              username.trim().length >= 3
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            C'est parti !
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${slide.gradient} text-white font-bold text-lg shadow-lg flex items-center gap-2`}
          >
            Suivant
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Spacer for alignment */}
        <div className="w-14" />
      </div>
    </div>
  );
}
