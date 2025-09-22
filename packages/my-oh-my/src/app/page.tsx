'use client';

import { motion } from 'framer-motion';
import { PriceDisplay } from '@/components/PriceDisplay';
import { PriceChart } from '@/components/PriceChart';
import { StatsGrid } from '@/components/StatsGrid';
import { TransactionsList } from '@/components/TransactionsList';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            XAVA ROCK
          </h1>
          <p className="text-xl text-gray-300">
            Real-time XAVA Token Dashboard
          </p>
        </motion.div>

        {/* Price Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PriceDisplay />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsGrid />
        </motion.div>

        {/* Chart and Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <PriceChart />
          </div>
          <div>
            <TransactionsList />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-400 text-sm py-8"
        >
          <p>Built with ❤️ for the XAVA community</p>
          <p className="mt-2">Real-time data updates every few seconds</p>
        </motion.footer>
      </div>
    </div>
  );
}



