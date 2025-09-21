'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

import { PriceDisplay } from '@/components/PriceDisplay';
import { PriceChart } from '@/components/PriceChart';
import { StatsGrid } from '@/components/StatsGrid';
import { TransactionsList } from '@/components/TransactionsList';
import { LiveIndicator } from '@/components/LiveIndicator';
import { api, TokenData } from '@/lib/api';

const queryClient = new QueryClient();

function Dashboard() {
  const [liveData, setLiveData] = useState<TokenData | null>(null);

  // Fetch initial data
  const { data: tokenData, isLoading: tokenLoading } = useQuery({
    queryKey: ['tokenData'],
    queryFn: api.getTokenData,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const { data: priceHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['priceHistory'],
    queryFn: () => api.getPriceHistory(30),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: api.getRecentTransactions,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = api.subscribeToPriceUpdates((data) => {
      setLiveData(data);
    });

    return unsubscribe;
  }, []);

  const currentData = liveData || tokenData;
  const isLoading = tokenLoading || historyLoading || transactionsLoading;

  if (isLoading || !currentData || !priceHistory || !transactions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">My Oh My</h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-white/80">XAVA Token Real-time Dashboard</p>
          <div className="flex items-center justify-center gap-4">
            <LiveIndicator />
            <div className="flex items-center gap-2 text-white/60">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Auto-refresh enabled</span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <PriceDisplay data={currentData} />
          </motion.div>

          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <PriceChart data={priceHistory} />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsGrid data={currentData} />
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TransactionsList transactions={transactions} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-white/60">
            Built with ❤️ for the XAVA community • Data updates every 3 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
