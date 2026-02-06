import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Flame, Gamepad2, Trophy, User } from 'lucide-react';

const tabs = [
  { id: '/', icon: Home, label: 'Accueil' },
  { id: '/feed', icon: Flame, label: 'Feed' },
  { id: '/play', icon: Gamepad2, label: 'Jouer', isMain: true },
  { id: '/leaderboard', icon: Trophy, label: 'Classement' },
  { id: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on quiz game screen
  if (location.pathname === '/quiz' || location.pathname === '/matchmaking') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl border-t border-white/5" />
      
      <div className="relative flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.id || 
            (tab.id === '/' && location.pathname === '/') ||
            (tab.id === '/play' && ['/play', '/game-mode'].includes(location.pathname));
          const Icon = tab.icon;

          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className="relative -mt-5 flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-[9px] font-bold text-violet-400 mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="flex flex-col items-center py-2 px-3 min-w-[56px]"
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-cyan-400' : 'text-white/30'}`} />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
                  />
                )}
              </div>
              <span className={`text-[9px] mt-1 transition-colors ${isActive ? 'text-cyan-400 font-bold' : 'text-white/30'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
