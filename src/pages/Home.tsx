import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="arcade-title text-4xl md:text-6xl mb-8">
            DEBATRIX
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            The future of intellectual discourse. Stake your ETH, prove your point, and earn rewards in this revolutionary debate platform.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/debates')}
              className="arcade-button group"
            >
              <span className="flex items-center justify-center gap-3">
                <Sword className="w-5 h-5" />
                Join a Debate
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/connect')}
              className="arcade-button group"
            >
              <span className="flex items-center justify-center gap-3">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </span>
            </motion.button>
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 mx-auto">
                <Sword className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-press-start text-sm mb-4">Engage in Debates</h3>
              <p className="text-gray-400 text-sm">
                Choose from a variety of topics and challenge others in structured, civilized debates.
              </p>
            </div>

            <div className="glass-panel p-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 mx-auto">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-press-start text-sm mb-4">Stake & Earn</h3>
              <p className="text-gray-400 text-sm">
                Put your ETH where your mouth is. Win debates to earn rewards from the stake pool.
              </p>
            </div>

            <div className="glass-panel p-6">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-press-start text-sm mb-4">AI Judging</h3>
              <p className="text-gray-400 text-sm">
                Experience fair and unbiased judging through our advanced AI system.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;