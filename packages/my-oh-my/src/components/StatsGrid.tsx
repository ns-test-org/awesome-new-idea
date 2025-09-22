'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { xavaApi, XavaStats } from '@/lib/api';

export function StatsGrid() {
  const [stats, setStats] = useState<XavaStats | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      const newStats = xavaApi.getStats();
      setStats(newStats);
    };

    // Initial fetch
    fetchStats();

    // Update every 10 seconds
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const statsData = [
    {
      title: 'Market Cap',
      value: `$${formatNumber(stats.marketCap)}`,
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: '24h Volume',
      value: `$${formatNumber(stats.volume24h)}`,
      icon: TrendingUp,
      color: 'text-blue-400'
    },
    {
      title: 'Holders',
      value: formatNumber(stats.holders),
      icon: Users,
      color: 'text-purple-400'
    },
    {
      title: 'Total Supply',
      value: formatNumber(stats.totalSupply),
      icon: Coins,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <motion.div
                key={stat.value}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                className={`text-2xl font-bold ${stat.color}`}
              >
                {stat.value}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
