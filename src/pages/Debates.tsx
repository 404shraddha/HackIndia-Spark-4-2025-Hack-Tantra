import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Timer, Brain, Coins, Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface DebateRoom {
  id: string;
  topic: string;
  stake: number;
  timeLimit: string;
  judge: "AI" | "Human";
  players: number;
  status: "Open" | "In Progress";
}

function Debates() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    minStake: 0,
    judge: "all",
    status: "all",
  });

  const debateRooms: DebateRoom[] = [
    {
      id: "1",
      topic: "Should AI systems have rights similar to humans?",
      stake: 2.5,
      timeLimit: "30:00",
      judge: "AI",
      players: 1,
      status: "Open",
    },
    {
      id: "2",
      topic: "Is cryptocurrency the future of global finance?",
      stake: 3.8,
      timeLimit: "45:00",
      judge: "Human",
      players: 2,
      status: "In Progress",
    },
  ];

  const handleJoinDebate = (id: string) => {
    navigate(`/debate-room/${id}`);
  };

  return (
    <div className="pt-20 min-h-screen container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="arcade-title text-3xl">ACTIVE DEBATES</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="arcade-button-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Debate
        </button>
      </div>

      <div className="glass-panel p-4 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-press-start">Filters:</span>
          </div>

          <select
            className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm"
            onChange={(e) => setFilters({ ...filters, judge: e.target.value })}
          >
            <option value="AI">AI Judge</option>
          </select>

          <select
            className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
          </select>

          <input
            type="number"
            placeholder="Min Stake (ETH)"
            className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm"
            onChange={(e) =>
              setFilters({ ...filters, minStake: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {debateRooms.map((debate) => (
          <motion.div
            key={debate.id}
            className="pixel-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="neon-border p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-press-start">
                    {debate.players}/2
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-press-start">
                    {debate.timeLimit}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-press-start mb-4 leading-relaxed">
                {debate.topic}
              </h3>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{debate.judge} Judge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-press-start text-emerald-400">
                    {debate.stake} ETH
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-press-start ${
                    debate.status === "In Progress"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {debate.status}
                </div>
                {debate.status === "Open" && (
                  <button
                    onClick={() => handleJoinDebate(debate.id)}
                    className="arcade-button-sm"
                  >
                    Join Debate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-8 max-w-md w-full mx-4"
          >
            <h2 className="arcade-title text-xl mb-6">CREATE DEBATE</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-press-start mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  className="w-full bg-black/30 border border-white/10 rounded px-3 py-2"
                  placeholder="Enter debate topic"
                />
              </div>

              <div>
                <label className="block text-sm font-press-start mb-2">
                  Stake (ETH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-black/30 border border-white/10 rounded px-3 py-2"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-press-start mb-2">
                  Time Limit
                </label>
                <select className="w-full bg-black/30 border border-white/10 rounded px-3 py-2">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-press-start mb-2">
                  Judge Type
                </label>
                <select className="w-full bg-black/30 border border-white/10 rounded px-3 py-2">
                  <option value="AI">AI Judge</option>
                  <option value="Human">Human Judge</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-white/10 rounded font-press-start text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 arcade-button-sm">
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Debates;
