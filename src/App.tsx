/**
 * QQUIZ PRODIGY - Main Application
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Onboarding from "./components/Onboarding";
import { getAssetPath } from "./lib/assets";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Chat = lazy(() => import("./components/Chat"));
const Friends = lazy(() => import("./components/Friends"));
const Duel = lazy(() => import("./components/Duel"));
const QuizGame = lazy(() => import("./components/QuizGame"));
const LeaderboardPage = lazy(() => import("./components/LeaderboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const GameMode = lazy(() => import("./pages/GameMode"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ChallengeSystem = lazy(() => import("./components/ChallengeSystem"));
const Matchmaking = lazy(() => import("./components/Matchmaking"));
const MessagesPage = lazy(() => import("./components/Chat"));

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-cyan-500 border-l-transparent animate-spin" />
          <img 
            src={getAssetPath('/images/logo/Logo_Principal_Neon.png')} 
            alt="QQUIZ PRODIGY"
            className="absolute inset-2 w-16 h-16 object-contain"
          />
        </div>
        <p className="text-white/60 text-sm">Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem('qquiz_onboarding_complete');
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          {showOnboarding && (
            <Onboarding onComplete={handleOnboardingComplete} />
          )}
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/duel" element={<Duel />} />
                <Route path="/play" element={<QuizGame />} />
                <Route path="/quiz" element={<QuizGame />} />
                <Route path="/game-mode" element={<GameMode />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/challenges" element={<ChallengeSystem />} />
                <Route path="/matchmaking" element={<Matchmaking mode="random" onCancel={() => window.history.back()} onMatchFound={(gameId, opponent) => console.log('Match found:', gameId, opponent)} />} />
                <Route path="/messages" element={<MessagesPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
