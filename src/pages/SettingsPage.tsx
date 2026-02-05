/**
 * QQUIZ PRODIGY - Settings Page
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff,
  Moon,
  Sun,
  Globe,
  Shield,
  HelpCircle,
  Star,
  Share2,
  LogOut,
  Trash2,
  ChevronRight,
  Smartphone,
  Download,
  Crown,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAssetPath } from '@/lib/assets';

interface SettingsState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  language: string;
}

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ln', name: 'Lingala', flag: '🇨🇩' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('qquiz_settings');
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      musicEnabled: true,
      notificationsEnabled: true,
      vibrationEnabled: true,
      darkMode: true,
      language: 'fr'
    };
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sauvegarder les paramètres
  useEffect(() => {
    localStorage.setItem('qquiz_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof SettingsState) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const handleDeleteAccount = () => {
    // Supprimer les données locales
    localStorage.removeItem('qquiz_user');
    localStorage.removeItem('qquiz_settings');
    localStorage.removeItem('qquiz_onboarding_complete');
    navigate('/');
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value, 
    onToggle, 
    isToggle = true,
    onClick,
    danger = false,
    premium = false
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    value?: boolean | string;
    onToggle?: () => void;
    isToggle?: boolean;
    onClick?: () => void;
    danger?: boolean;
    premium?: boolean;
  }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick || onToggle}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
        danger 
          ? 'bg-red-500/10 hover:bg-red-500/20' 
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        danger 
          ? 'bg-red-500/20' 
          : premium 
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
            : 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20'
      }`}>
        <Icon className={`w-5 h-5 ${
          danger ? 'text-red-400' : premium ? 'text-yellow-400' : 'text-violet-400'
        }`} />
      </div>
      
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
            {title}
          </span>
          {premium && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-[10px] font-bold text-black">
              PRO
            </span>
          )}
        </div>
        {subtitle && (
          <span className="text-sm text-white/50">{subtitle}</span>
        )}
      </div>

      {isToggle && typeof value === 'boolean' ? (
        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
          value ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'bg-white/20'
        }`}>
          <motion.div
            animate={{ x: value ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-5 h-5 rounded-full bg-white shadow-lg"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/50">
          {typeof value === 'string' && <span className="text-sm">{value}</span>}
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Réglages</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Télécharger l'App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Smartphone className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-lg font-bold text-white">Télécharge l'App</h3>
                <p className="text-white/80 text-sm">Joue partout, même hors ligne !</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-black/30 hover:bg-black/40 text-white py-3 px-4 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-medium">iOS</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-black/30 hover:bg-black/40 text-white py-3 px-4 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-medium">Android</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">QQUIZ PRO</h3>
              <p className="text-white/60 text-sm">Sans pub, vies illimitées, badges exclusifs</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Son & Vibration */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
            Son & Vibration
          </h2>
          <div className="space-y-2">
            <SettingItem
              icon={settings.soundEnabled ? Volume2 : VolumeX}
              title="Effets sonores"
              subtitle="Sons pendant le jeu"
              value={settings.soundEnabled}
              onToggle={() => toggleSetting('soundEnabled')}
            />
            <SettingItem
              icon={settings.musicEnabled ? Volume2 : VolumeX}
              title="Musique"
              subtitle="Musique de fond"
              value={settings.musicEnabled}
              onToggle={() => toggleSetting('musicEnabled')}
            />
            <SettingItem
              icon={Zap}
              title="Vibration"
              subtitle="Retour haptique"
              value={settings.vibrationEnabled}
              onToggle={() => toggleSetting('vibrationEnabled')}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
            Notifications
          </h2>
          <div className="space-y-2">
            <SettingItem
              icon={settings.notificationsEnabled ? Bell : BellOff}
              title="Notifications push"
              subtitle="Défis, classement, amis"
              value={settings.notificationsEnabled}
              onToggle={() => toggleSetting('notificationsEnabled')}
            />
          </div>
        </div>

        {/* Apparence */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
            Apparence
          </h2>
          <div className="space-y-2">
            <SettingItem
              icon={settings.darkMode ? Moon : Sun}
              title="Mode sombre"
              subtitle="Thème de l'application"
              value={settings.darkMode}
              onToggle={() => toggleSetting('darkMode')}
            />
            <SettingItem
              icon={Globe}
              title="Langue"
              subtitle="Changer la langue"
              value={LANGUAGES.find(l => l.code === settings.language)?.name || 'Français'}
              isToggle={false}
              onClick={() => setShowLanguageModal(true)}
            />
          </div>
        </div>

        {/* Support */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
            Support
          </h2>
          <div className="space-y-2">
            <SettingItem
              icon={HelpCircle}
              title="Aide & FAQ"
              subtitle="Questions fréquentes"
              isToggle={false}
              onClick={() => {}}
            />
            <SettingItem
              icon={Shield}
              title="Confidentialité"
              subtitle="Politique de confidentialité"
              isToggle={false}
              onClick={() => {}}
            />
            <SettingItem
              icon={Star}
              title="Noter l'app"
              subtitle="Laisse un avis"
              isToggle={false}
              onClick={() => {}}
            />
            <SettingItem
              icon={Share2}
              title="Partager l'app"
              subtitle="Invite tes amis"
              isToggle={false}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'QQUIZ PRODIGY',
                    text: 'Défie-moi sur QQUIZ PRODIGY !',
                    url: window.location.origin
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Compte */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
            Compte
          </h2>
          <div className="space-y-2">
            {user ? (
              <SettingItem
                icon={LogOut}
                title="Déconnexion"
                subtitle={user.email || ''}
                isToggle={false}
                onClick={() => setShowLogoutModal(true)}
              />
            ) : (
              <SettingItem
                icon={LogOut}
                title="Se connecter"
                subtitle="Synchronise ta progression"
                isToggle={false}
                onClick={() => navigate('/auth')}
              />
            )}
            <SettingItem
              icon={Trash2}
              title="Supprimer mes données"
              subtitle="Réinitialiser la progression"
              isToggle={false}
              danger
              onClick={() => setShowDeleteModal(true)}
            />
          </div>
        </div>

        {/* Version */}
        <div className="text-center py-6">
          <img 
            src={getAssetPath('/images/logo/Logo_Principal_Neon.png')} 
            alt="QQUIZ PRODIGY"
            className="w-16 h-16 mx-auto mb-3 opacity-50"
          />
          <p className="text-white/30 text-sm">QQUIZ PRODIGY v1.0.0</p>
          <p className="text-white/20 text-xs mt-1">© 2024-2026 Tous droits réservés</p>
        </div>
      </div>

      {/* Modal Langue */}
      {showLanguageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowLanguageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Choisir la langue</h3>
            <div className="space-y-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, language: lang.code }));
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    settings.language === lang.code
                      ? 'bg-violet-500/20 border border-violet-500'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-white font-medium">{lang.name}</span>
                  {settings.language === lang.code && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Déconnexion */}
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
              <LogOut className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Se déconnecter ?</h3>
            <p className="text-white/60 mb-6">Ta progression locale sera conservée.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Supprimer */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Supprimer mes données ?</h3>
            <p className="text-white/60 mb-6">Cette action est irréversible. Toute ta progression sera perdue.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
