import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Trophy, Users, Flame } from 'lucide-react';
import { getAssetPath } from '@/lib/assets';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (!username.trim()) { setError('Le pseudo est requis'); return; }
        await signUp(email, password, username);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleGoogleAuth = async () => {
    try { await signInWithGoogle(); } catch (err: any) { setError(err.message || 'Erreur Google'); }
  };

  const handleSkip = () => {
    localStorage.setItem('qquiz_guest', 'true');
    navigate('/');
  };

  const features = [
    { icon: Trophy, text: 'Sauvegarde ta progression', color: 'text-yellow-400' },
    { icon: Users, text: 'Défie tes amis', color: 'text-cyan-400' },
    { icon: Flame, text: 'Garde ta série active', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <button onClick={handleSkip} className="text-sm text-white/40 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
          Passer
        </button>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 -mt-10">
        {/* Logo */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6">
          <img src={getAssetPath('/images/logo/Logo_Principal_Neon.png')} alt="QQUIZ PRODIGY" className="w-20 h-20 mx-auto" />
        </motion.div>

        {/* Title */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-1">
            {mode === 'login' ? 'Content de te revoir !' : 'Rejoins la communauté !'}
          </h1>
          <p className="text-sm text-white/40">
            {mode === 'login' ? 'Connecte-toi pour continuer' : 'Crée ton compte en 30 secondes'}
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full max-w-sm mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-full max-w-sm">
          {/* Google Button */}
          <button onClick={handleGoogleAuth} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white rounded-xl text-gray-800 font-semibold text-sm hover:bg-white/90 transition-all active:scale-[0.98] mb-3 disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Apple Button */}
          <button disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-semibold text-sm hover:bg-white/10 transition-all active:scale-[0.98] mb-5 disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continuer avec Apple
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/20 font-medium uppercase tracking-wider">ou par email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="relative mb-3">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4 text-white/20" /> : <Eye className="w-4 h-4 text-white/20" />}
              </button>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-violet-400 hover:text-violet-300">Mot de passe oublié ?</button>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 mt-1">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-5">
            <span className="text-xs text-white/30">{mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}</span>
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-xs text-violet-400 font-bold ml-1 hover:text-violet-300">{mode === 'login' ? "S'inscrire" : 'Se connecter'}</button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-6 mt-10">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <span className="text-[9px] text-white/30 text-center max-w-[70px]">{f.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
