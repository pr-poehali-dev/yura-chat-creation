import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

interface Message {
  id: string;
  text: string;
  user: User;
  timestamp: Date;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'GG everyone, that was close ome!',
      user: { id: 'admin', name: 'PlayerOne', isAdmin: true },
      timestamp: new Date()
    },
    {
      id: '2',  
      text: 'Totally agree! Great game 🎮',
      user: { id: 'user1', name: 'GamerX', isAdmin: false },
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        name: username.trim(),
        isAdmin: username.toLowerCase().includes('admin')
      };
      setUser(newUser);
      localStorage.setItem('chatUser', JSON.stringify(newUser));
      setUsername('');
      setIsRegistering(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        user,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gaming-card border-neon-green/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2 animate-fade-in">
              🎮 GAMING CHAT
            </CardTitle>
            <p className="text-gray-400">Подключиться к чату</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Введите никнейм..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gaming-dark border-neon-blue/30 text-white placeholder-gray-500 focus:border-neon-green"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Включите "admin" в никнейм для админ статуса
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-neon-green hover:bg-neon-green/80 text-black font-bold py-3 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/30"
              >
                <Icon name="Zap" size={20} className="mr-2" />
                ВОЙТИ В ИГРУ
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gaming-card border-b border-neon-blue/20 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold text-white">Gaming Chat</h1>
            <Badge variant="outline" className="border-neon-pink text-neon-pink">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user.isAdmin && (
                <Badge className="bg-neon-pink text-white">
                  <Icon name="Shield" size={14} className="mr-1" />
                  ADMIN
                </Badge>
              )}
              <span className="text-white font-medium">{user.name}</span>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <Card className="bg-gaming-card border-gaming-card hover:border-neon-blue/30 transition-colors duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-neon-blue" />
                      </div>
                      <span className="font-medium text-white">{message.user.name}</span>
                      {message.user.isAdmin && (
                        <Badge className="bg-neon-pink/20 text-neon-pink border-neon-pink/30 text-xs">
                          ADMIN
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{message.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-neon-blue/20 bg-gaming-card">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Напишите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-gaming-dark border-neon-blue/30 text-white placeholder-gray-500 focus:border-neon-green"
            />
            <Button
              type="submit"
              className="bg-neon-green hover:bg-neon-green/80 text-black font-medium px-6 transition-all duration-200 hover:shadow-lg hover:shadow-neon-green/20"
            >
              <Icon name="Send" size={18} />
            </Button>
          </form>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gaming-card border-l border-neon-blue/20 p-4">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center">
          <Icon name="Users" size={20} className="mr-2 text-neon-green" />
          Игроки онлайн
        </h2>
        
        <div className="space-y-2">
          {/* Current User */}
          <Card className="bg-gaming-dark border-neon-green/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-white font-medium">{user.name} (вы)</span>
                </div>
                {user.isAdmin && (
                  <Badge className="bg-neon-pink text-white text-xs">
                    ADMIN
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Other Users */}
          <Card className="bg-gaming-dark border-gaming-card">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-white">PlayerOne</span>
                </div>
                <Badge className="bg-neon-pink text-white text-xs">
                  ADMIN
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark border-gaming-card">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-white">GamerX</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Статистика</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Всего игроков:</span>
              <span className="text-neon-green">3</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Админов:</span>
              <span className="text-neon-pink">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;