import { useState } from 'react';
import { UserPlus, MessageCircle, Swords, Check, X, Search } from 'lucide-react';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  isOnline: boolean;
  status: 'accepted' | 'pending' | 'blocked';
}

export default function Friends() {
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      username: 'ProGamer243',
      displayName: 'Pro Gamer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer243',
      level: 45,
      isOnline: true,
      status: 'accepted'
    },
    {
      id: '2',
      username: 'QuizMaster_RDC',
      displayName: 'Quiz Master',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuizMaster_RDC',
      level: 42,
      isOnline: true,
      status: 'accepted'
    },
    {
      id: '3',
      username: 'BrainStorm_243',
      displayName: 'Brain Storm',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BrainStorm_243',
      level: 40,
      isOnline: false,
      status: 'accepted'
    },
    {
      id: '4',
      username: 'NewPlayer123',
      displayName: 'New Player',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewPlayer123',
      level: 5,
      isOnline: false,
      status: 'pending'
    }
  ]);

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         friend.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'online') return friend.isOnline && friend.status === 'accepted' && matchesSearch;
    if (activeTab === 'pending') return friend.status === 'pending' && matchesSearch;
    return friend.status === 'accepted' && matchesSearch;
  });

  const pendingCount = friends.filter(f => f.status === 'pending').length;

  const handleAcceptFriend = (friendId: string) => {
    setFriends(friends.map(f => 
      f.id === friendId ? { ...f, status: 'accepted' as const } : f
    ));
  };

  const handleRejectFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const handleSendMessage = (friendId: string) => {
    console.log('Send message to:', friendId);
    // À implémenter : ouvrir le chat
  };

  const handleChallenge = (friendId: string) => {
    console.log('Challenge:', friendId);
    // À implémenter : lancer un duel
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-purple-500/20 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Amis</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ami..."
            className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveTab('online')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'online'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            En ligne
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`relative flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            En attente
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredFriends.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun ami trouvé</p>
            <p className="text-sm mt-2">Commence à ajouter des amis pour jouer ensemble !</p>
          </div>
        ) : (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="w-16 h-16 rounded-full border-2 border-purple-500"
                  />
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{friend.displayName}</h3>
                  <p className="text-sm text-gray-400 truncate">@{friend.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">
                      Niveau {friend.level}
                    </span>
                    {friend.isOnline && (
                      <span className="text-xs text-green-400">En ligne</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {friend.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAcceptFriend(friend.id)}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                        title="Accepter"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectFriend(friend.id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                        title="Refuser"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSendMessage(friend.id)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-purple-400 transition-colors"
                        title="Message"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleChallenge(friend.id)}
                        className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all"
                        title="Défier"
                      >
                        <Swords className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Friend Button */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-t border-purple-500/20 p-4">
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
          <UserPlus className="w-5 h-5" />
          Ajouter un ami
        </button>
      </div>
    </div>
  );
}
