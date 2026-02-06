import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Gift, Target, Clock, ChevronRight, 
  Zap, Star, Trophy, X, Check
} from 'lucide-react';
import {
  getRetentionData, claimDailyReward, isDailyRewardAvailable,
  getTimeUntilReset, getStreakMultiplier, RetentionData
} from '../lib/retentionSystem';

export default function DailyHub() {
  const navigate = useNavigate();
  const [data, setData] = useState<RetentionData>(getRetentionData());
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{ xp: number; day: number; icon: string } | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilReset(getTimeUntilReset());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimReward = () => {
    const reward = claimDailyReward();
    if (reward) {
      setClaimedReward(reward);
      setShowRewardPopup(true);
      setData(getRetentionData());
    }
  };

  const streakMultiplier = getStreakMultiplier(data.streak.currentStreak);
  const canClaim = isDailyRewardAvailable();
  const completedChallenges = data.dailyChallenges.filter(c => c.completed).length;
  const totalChallenges = data.dailyChallenges.length;

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const today = new Date().getDay();

  return (
    <>
      <div className="space-y-4 px-4 py-3">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{data.streak.currentStreak} jours</div>
                <div className="text-[10px] text-orange-300/60">Record : {data.streak.longestStreak} jours</div>
              </div>
            </div>
            {streakMultiplier > 1 && (
              <div className="bg-orange-500/20 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-orange-400">XP x{streakMultiplier}</span>
              </div>
            )}
          </div>

          {/* Weekly progress dots */}
          <div className="flex justify-between">
            {dayNames.map((day, i) => {
              const isToday = i === today;
              const hasPlayed = data.weeklyProgress[i] > 0;
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isToday
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ring-2 ring-orange-500/30'
                      : hasPlayed
                        ? 'bg-orange-500/30 text-orange-400'
                        : 'bg-white/5 text-white/20'
                  }`}>
                    {hasPlayed ? <Check className="w-3.5 h-3.5" /> : day[0]}
                  </div>
                  <span className={`text-[9px] ${isToday ? 'text-orange-400 font-bold' : 'text-white/30'}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Daily Reward */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={canClaim ? handleClaimReward : undefined}
            disabled={!canClaim}
            className={`w-full rounded-2xl p-4 border transition-all ${
              canClaim
                ? 'bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 border-violet-500/30 hover:border-violet-500/50 active:scale-[0.98]'
                : 'bg-white/3 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  canClaim ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse' : 'bg-white/10'
                }`}>
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">
                    {canClaim ? 'Récompense quotidienne !' : 'Déjà réclamé'}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {canClaim ? 'Touche pour réclamer' : `Prochain dans ${timeUntilReset}`}
                  </div>
                </div>
              </div>
              {canClaim && (
                <div className="flex items-center gap-1 bg-violet-500/20 px-3 py-1.5 rounded-full">
                  <Star className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-bold text-violet-400">Réclamer</span>
                </div>
              )}
            </div>

            {/* 7-day reward preview */}
            <div className="flex justify-between mt-3 pt-3 border-t border-white/5">
              {data.dailyRewards.map((reward, i) => {
                const isActive = (data.streak.currentStreak - 1) % 7 === i;
                return (
                  <div key={i} className={`flex flex-col items-center gap-0.5 ${isActive ? 'scale-110' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      reward.claimed ? 'bg-green-500/20' : isActive ? 'bg-violet-500/30 ring-1 ring-violet-500/50' : 'bg-white/5'
                    }`}>
                      {reward.claimed ? <Check className="w-3 h-3 text-green-400" /> : reward.icon}
                    </div>
                    <span className="text-[8px] text-white/30">J{reward.day}</span>
                  </div>
                );
              })}
            </div>
          </button>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/3 border border-white/5 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold text-sm">Défis du jour</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-cyan-400 font-bold">{completedChallenges}/{totalChallenges}</span>
              <Clock className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30">{timeUntilReset}</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {data.dailyChallenges.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center gap-3 px-4 py-3 ${challenge.completed ? 'opacity-60' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                  challenge.completed ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  {challenge.completed ? <Check className="w-4 h-4 text-green-400" /> : challenge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold ${challenge.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                    {challenge.title}
                  </div>
                  <div className="text-[10px] text-white/30 truncate">{challenge.description}</div>
                  {/* Progress bar */}
                  {!challenge.completed && (
                    <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-[10px] font-bold text-yellow-400">+{challenge.xpReward}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reward Popup */}
      <AnimatePresence>
        {showRewardPopup && claimedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowRewardPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 mx-4 max-w-sm w-full border border-violet-500/20 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {claimedReward.icon}
              </motion.div>
              <h3 className="text-xl font-black text-white mb-1">Récompense Jour {claimedReward.day} !</h3>
              <p className="text-violet-400 font-bold text-lg mb-1">+{claimedReward.xp} XP</p>
              <p className="text-white/40 text-xs mb-4">Continue ta série pour des récompenses encore meilleures !</p>
              
              <button
                onClick={() => setShowRewardPopup(false)}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
              >
                Merci !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
