import React, { useState } from 'react';
import { Crown, Star, Trophy, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Debater {
  rank: number;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
  earnings: number;
  badges: string[];
  winStreak: number;
}

function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [selectedDebater, setSelectedDebater] = useState<Debater | null>(null);

  const debaters: Debater[] = [
    {
      rank: 1,
      name: 'CryptoKing',
      avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400&h=400&fit=crop',
      wins: 28,
      losses: 5,
      earnings: 155.5,
      badges: ['Legendary', 'Streak Master', 'Crowd Favorite'],
      winStreak: 8
    },
    {
      rank: 2,
      name: 'LogicMaster',
      avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400&h=400&fit=crop',
      wins: 24,
      losses: 8,
      earnings: 120.8,
      badges: ['Elite', 'Quick Thinker'],
      winStreak: 4
    },
    {
      rank: 3,
      name: 'DebateQueen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      wins: 22,
      losses: 7,
      earnings: 98.2,
      badges: ['Master', 'Persuasive'],
      winStreak: 3
    }
  ];

  return (
    <div className="pt-20 min-h-screen container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="arcade-title text-3xl">LEADERBOARD</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-lg font-press-start text-xs ${
              timeframe === 'weekly' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/30'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-lg font-press-start text-xs ${
              timeframe === 'monthly' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/30'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-4 py-2 rounded-lg font-press-start text-xs ${
              timeframe === 'all' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/30'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {debaters.map((debater, index) => (
            <motion.div
              key={debater.rank}
              className="neon-border p-6 cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setSelectedDebater(debater)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  {index === 0 ? (
                    <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
                  ) : (
                    <Star className="absolute -top-2 -right-2 w-6 h-6 text-purple-500" />
                  )}
                  <img
                    src={debater.avatar}
                    alt={debater.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-press-start text-sm">{debater.name}</h3>
                    <div className="flex gap-1">
                      {debater.badges.map((badge, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{debater.wins}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>{debater.winStreak} streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span>{debater.earnings} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel p-6">
          {selectedDebater ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <img
                  src={selectedDebater.avatar}
                  alt={selectedDebater.name}
                  className="w-24 h-24 rounded-lg mx-auto mb-4"
                />
                <h2 className="font-press-start text-xl mb-2">{selectedDebater.name}</h2>
                <div className="flex justify-center gap-2 mb-4">
                  {selectedDebater.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                  <div className="text-2xl font-press-start text-emerald-400">
                    {((selectedDebater.wins / (selectedDebater.wins + selectedDebater.losses)) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 bg-black/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
                  <div className="text-2xl font-press-start text-emerald-400">
                    {selectedDebater.earnings} ETH
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="font-press-start text-sm mb-4">Recent Debates</h3>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>vs. Opponent #{i + 1}</span>
                      </div>
                      <span className="text-gray-400">2.5 ETH</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 font-press-start text-sm">
              Select a debater to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;