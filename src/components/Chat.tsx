import { useState, useRef, useEffect } from 'react';
import { Send, Image, Video, Smile, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatProps {
  conversationId?: string;
  currentUserId?: string;
  onSendMessage?: (message: string, mediaUrl?: string, messageType?: string) => void;
}

export default function Chat({ conversationId = 'global', currentUserId = 'user1', onSendMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'user2',
      senderName: 'ProGamer243',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer243',
      content: 'Salut ! Prêt pour un duel ? 🎮',
      messageType: 'text',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false
    },
    {
      id: '2',
      senderId: currentUserId,
      senderName: 'Toi',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: 'Ouais, let\'s go ! 🔥',
      messageType: 'text',
      timestamp: new Date(Date.now() - 120000),
      isOwn: true
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'Toi',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: inputMessage,
      messageType: 'text',
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    if (onSendMessage) {
      onSendMessage(inputMessage);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simuler l'upload (à remplacer par Supabase Storage)
    setTimeout(() => {
      const messageType = file.type.startsWith('image/') ? 'image' : 
                         file.type.startsWith('video/') ? 'video' : 'file';
      
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: 'Toi',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        content: file.name,
        messageType,
        mediaUrl: URL.createObjectURL(file),
        timestamp: new Date(),
        isOwn: true
      };

      setMessages([...messages, newMessage]);
      setIsUploading(false);

      if (onSendMessage) {
        onSendMessage(file.name, newMessage.mediaUrl, messageType);
      }
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-purple-500/20 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer243"
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-purple-500"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-white">ProGamer243</h3>
            <p className="text-xs text-green-400">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isOwn
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.messageType === 'text' && (
                  <p className="text-sm">{message.content}</p>
                )}
                {message.messageType === 'image' && message.mediaUrl && (
                  <div className="space-y-2">
                    <img
                      src={message.mediaUrl}
                      alt="Shared"
                      className="rounded-lg max-w-full h-auto"
                    />
                    <p className="text-xs opacity-75">{message.content}</p>
                  </div>
                )}
                {message.messageType === 'video' && message.mediaUrl && (
                  <div className="space-y-2">
                    <video
                      src={message.mediaUrl}
                      controls
                      className="rounded-lg max-w-full h-auto"
                    />
                    <p className="text-xs opacity-75">{message.content}</p>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-t border-purple-500/20 p-4">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-purple-400 transition-colors disabled:opacity-50"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-purple-400 transition-colors disabled:opacity-50"
          >
            <Image className="w-5 h-5" />
          </button>

          <button
            disabled={isUploading}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-purple-400 transition-colors disabled:opacity-50"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            disabled={isUploading}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-purple-400 transition-colors disabled:opacity-50"
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Écris un message..."
            disabled={isUploading}
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isUploading}
            className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isUploading && (
          <div className="mt-2 text-sm text-purple-400 animate-pulse">
            Upload en cours...
          </div>
        )}
      </div>
    </div>
  );
}
