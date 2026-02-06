import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Image, Smile, ArrowLeft, Swords, Trophy, 
  Flame, Heart, ThumbsUp, Laugh, Star, Zap,
  MoreVertical, Phone, Video, Search, X, Camera
} from 'lucide-react';

// Réactions rapides quiz-themed
const QUICK_REACTIONS = [
  { emoji: '🔥', label: 'Feu' },
  { emoji: '💪', label: 'GG' },
  { emoji: '😂', label: 'MDR' },
  { emoji: '👏', label: 'Bravo' },
  { emoji: '😤', label: 'Revanche' },
  { emoji: '🧠', label: 'Big Brain' },
  { emoji: '💀', label: 'Dead' },
  { emoji: '👑', label: 'King' },
];

// Messages rapides pré-définis pour engagement
const QUICK_MESSAGES = [
  'GG bien joué !',
  'Revanche ? 🔥',
  'T\'es trop fort !',
  'La prochaine c\'est pour moi',
  'On refait ?',
  'Bien joué le combo !',
];

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  messageType: 'text' | 'image' | 'system' | 'challenge' | 'result';
  mediaUrl?: string;
  timestamp: Date;
  isOwn: boolean;
  reactions?: { emoji: string; userId: string }[];
  gameResult?: {
    winner: string;
    score1: number;
    score2: number;
    category: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: Date;
  unread: number;
  online: boolean;
  level: number;
  league: string;
}

// Conversations simulées
const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'KingQuiz243', avatar: 'KingQuiz243', lastMessage: 'GG bien joué ! 🔥', lastTime: new Date(Date.now() - 120000), unread: 2, online: true, level: 15, league: 'Or' },
  { id: '2', name: 'ProdigyMaster', avatar: 'ProdigyMaster', lastMessage: 'Revanche en RAP ?', lastTime: new Date(Date.now() - 3600000), unread: 0, online: true, level: 22, league: 'Diamant' },
  { id: '3', name: 'BrainStorm', avatar: 'BrainStorm', lastMessage: 'Tu m\'as détruit en Science 😂', lastTime: new Date(Date.now() - 7200000), unread: 1, online: false, level: 18, league: 'Platine' },
  { id: '4', name: 'QuizNinja', avatar: 'QuizNinja', lastMessage: 'On fait une partie ?', lastTime: new Date(Date.now() - 86400000), unread: 0, online: false, level: 10, league: 'Argent' },
  { id: '5', name: 'LeopardKin', avatar: 'LeopardKin', lastMessage: 'Score: 180 vs 120 💪', lastTime: new Date(Date.now() - 172800000), unread: 0, online: true, level: 25, league: 'Légende' },
];

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = MOCK_CONVERSATIONS.find(c => c.id === activeConversation);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation messages
  useEffect(() => {
    if (activeConversation) {
      const conv = MOCK_CONVERSATIONS.find(c => c.id === activeConversation);
      if (conv) {
        setMessages([
          {
            id: 'sys1',
            senderId: 'system',
            senderName: 'Système',
            senderAvatar: '',
            content: `Résultat du duel : ${conv.name} vs Toi`,
            messageType: 'result',
            timestamp: new Date(Date.now() - 600000),
            isOwn: false,
            gameResult: {
              winner: Math.random() > 0.5 ? 'Toi' : conv.name,
              score1: Math.floor(Math.random() * 100) + 80,
              score2: Math.floor(Math.random() * 100) + 60,
              category: ['RAP', 'Sport', 'Manga', 'Netflix', 'NBA'][Math.floor(Math.random() * 5)]
            }
          },
          {
            id: '1',
            senderId: conv.id,
            senderName: conv.name,
            senderAvatar: conv.avatar,
            content: conv.lastMessage,
            messageType: 'text',
            timestamp: conv.lastTime,
            isOwn: false,
            reactions: [{ emoji: '🔥', userId: 'me' }]
          }
        ]);
      }

      // Simulate typing indicator
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 3000);

      return () => clearTimeout(typingTimeout);
    }
  }, [activeConversation]);

  const handleSendMessage = (text?: string) => {
    const content = text || inputMessage.trim();
    if (!content) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Toi',
      senderAvatar: 'You',
      content,
      messageType: 'text',
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setShowQuickMessages(false);

    // Simulate response after delay
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'Haha bien joué ! 🔥',
          'On refait ? Je suis chaud',
          'T\'es fort en vrai 💪',
          'La prochaine c\'est pour moi !',
          'GG ! Tu gères',
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: activeConversation || '',
          senderName: activeConv?.name || '',
          senderAvatar: activeConv?.avatar || '',
          content: responses[Math.floor(Math.random() * responses.length)],
          messageType: 'text',
          timestamp: new Date(),
          isOwn: false,
        };
        setMessages(prev => [...prev, response]);
      }, 1500 + Math.random() * 2000);
    }, 500);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.findIndex(r => r.userId === 'me');
        if (existing >= 0) {
          reactions[existing] = { emoji, userId: 'me' };
        } else {
          reactions.push({ emoji, userId: 'me' });
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
    setShowReactions(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Toi',
      senderAvatar: 'You',
      content: '',
      messageType: 'image',
      mediaUrl: url,
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'maintenant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getLeagueColor = (league: string) => {
    const colors: Record<string, string> = {
      'Bronze': 'text-amber-600',
      'Argent': 'text-gray-400',
      'Or': 'text-yellow-400',
      'Platine': 'text-cyan-400',
      'Diamant': 'text-blue-400',
      'Légende': 'text-purple-400',
    };
    return colors[league] || 'text-gray-400';
  };

  // ============ CONVERSATION LIST VIEW ============
  if (!activeConversation) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <h1 className="text-lg font-bold text-white">Messages</h1>
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 -mr-2 rounded-xl hover:bg-white/5 transition-colors">
              <Search className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un joueur..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Online players strip */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {MOCK_CONVERSATIONS.filter(c => c.online).map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.avatar}`}
                    alt={conv.name}
                    className="w-14 h-14 rounded-full border-2 border-violet-500/50"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-950" />
                </div>
                <span className="text-[10px] text-white/60 max-w-[60px] truncate">{conv.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations list */}
        <div className="divide-y divide-white/5">
          {MOCK_CONVERSATIONS
            .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((conv, i) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveConversation(conv.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors active:bg-white/10"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.avatar}`}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full"
                />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm truncate">{conv.name}</span>
                  <span className={`text-[10px] font-bold ${getLeagueColor(conv.league)}`}>Niv.{conv.level}</span>
                </div>
                <p className="text-xs text-white/40 truncate mt-0.5">{conv.lastMessage}</p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-white/30">{formatTime(conv.lastTime)}</span>
                {conv.unread > 0 && (
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-violet-500 text-white text-[10px] font-bold rounded-full px-1">
                    {conv.unread}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 px-2 py-2 safe-area-bottom">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            {[
              { icon: '🏠', label: 'Accueil', path: '/' },
              { icon: '📰', label: 'Feed', path: '/feed' },
              { icon: '🎮', label: 'Jouer', path: '/game-mode', isMain: true },
              { icon: '💬', label: 'Chat', path: '/chat', active: true },
              { icon: '👤', label: 'Profil', path: '/profile' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                  item.active ? 'text-violet-400' : 'text-white/40 hover:text-white/60'
                } ${item.isMain ? 'relative -top-3' : ''}`}
              >
                {item.isMain ? (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                ) : (
                  <span className="text-lg">{item.icon}</span>
                )}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============ ACTIVE CONVERSATION VIEW ============
  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
      {/* Chat Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <button
            onClick={() => setActiveConversation(null)}
            className="p-2 -ml-1 rounded-xl hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConv?.avatar}`}
                alt={activeConv?.name}
                className="w-9 h-9 rounded-full"
              />
              {activeConv?.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-950" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm truncate">{activeConv?.name}</h3>
              <p className="text-[10px] text-green-400">
                {activeConv?.online ? 'En ligne' : 'Hors ligne'} · <span className={getLeagueColor(activeConv?.league || '')}>Niv.{activeConv?.level} {activeConv?.league}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/play?opponent=${activeConv?.name}`)}
              className="p-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 transition-colors"
            >
              <Swords className="w-4 h-4 text-violet-400" />
            </button>
            <button className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <MoreVertical className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {messages.map((message) => (
          <div key={message.id}>
            {/* Game Result Card */}
            {message.messageType === 'result' && message.gameResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-[280px] mb-4"
              >
                <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[10px] text-violet-400 font-medium mb-2">RÉSULTAT DU DUEL</div>
                  <div className="text-xs text-white/50 mb-2">{message.gameResult.category}</div>
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{message.gameResult.score1}</div>
                      <div className="text-[10px] text-white/40">Toi</div>
                    </div>
                    <div className="text-xs text-white/20 font-bold">VS</div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white/60">{message.gameResult.score2}</div>
                      <div className="text-[10px] text-white/40">{activeConv?.name}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${message.gameResult.winner === 'Toi' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.gameResult.winner === 'Toi' ? 'Victoire !' : 'Défaite'}
                  </div>
                  <button
                    onClick={() => navigate(`/play?category=${message.gameResult?.category}`)}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Revanche
                  </button>
                </div>
              </motion.div>
            )}

            {/* Regular Message */}
            {(message.messageType === 'text' || message.messageType === 'image') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!message.isOwn && (
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderAvatar}`}
                    alt=""
                    className="w-7 h-7 rounded-full flex-shrink-0 mt-1"
                  />
                )}
                <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                  <div
                    className={`relative rounded-2xl px-3.5 py-2 ${
                      message.isOwn
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                        : 'bg-white/8 text-white rounded-bl-md'
                    }`}
                    onDoubleClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
                  >
                    {message.messageType === 'text' && (
                      <p className="text-[13px] leading-relaxed">{message.content}</p>
                    )}
                    {message.messageType === 'image' && message.mediaUrl && (
                      <img src={message.mediaUrl} alt="" className="rounded-xl max-w-full max-h-[200px] object-cover" />
                    )}
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className={`flex gap-0.5 mt-0.5 ${message.isOwn ? 'mr-1' : 'ml-1'}`}>
                      {message.reactions.map((r, i) => (
                        <span key={i} className="text-xs bg-white/10 rounded-full px-1.5 py-0.5">{r.emoji}</span>
                      ))}
                    </div>
                  )}

                  {/* Reaction picker */}
                  <AnimatePresence>
                    {showReactions === message.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex gap-1 mt-1 bg-slate-800 rounded-full px-2 py-1 border border-white/10"
                      >
                        {QUICK_REACTIONS.map(r => (
                          <button
                            key={r.emoji}
                            onClick={() => handleReaction(message.id, r.emoji)}
                            className="hover:scale-125 transition-transform p-0.5"
                          >
                            <span className="text-sm">{r.emoji}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <span className="text-[10px] text-white/20 mt-0.5 px-1">{formatTime(message.timestamp)}</span>
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConv?.avatar}`}
                alt=""
                className="w-7 h-7 rounded-full"
              />
              <div className="bg-white/8 rounded-2xl rounded-bl-md px-4 py-2.5">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-white/40 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      <AnimatePresence>
        {showQuickMessages && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-slate-950/50 backdrop-blur-xl"
          >
            <div className="flex flex-wrap gap-2 p-3">
              {QUICK_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(msg)}
                  className="px-3 py-1.5 bg-violet-500/15 border border-violet-500/20 rounded-full text-xs text-violet-300 hover:bg-violet-500/25 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t border-white/5 bg-slate-950/80 backdrop-blur-xl p-3 safe-area-bottom">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Camera className="w-5 h-5 text-white/40" />
          </button>

          <button
            onClick={() => setShowQuickMessages(!showQuickMessages)}
            className={`p-2 rounded-xl transition-colors ${showQuickMessages ? 'bg-violet-500/20 text-violet-400' : 'hover:bg-white/5 text-white/40'}`}
          >
            <Zap className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-full px-4 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="p-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white disabled:opacity-30 transition-opacity shadow-lg shadow-violet-500/20"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
