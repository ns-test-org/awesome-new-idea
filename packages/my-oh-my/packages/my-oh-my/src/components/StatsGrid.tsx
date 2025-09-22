'use client';

import { motion } from 'framer-motion';
import { Users, Coins, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TokenData } from '@/lib/api';

interface StatsGridProps {
  data: TokenData;
}

export function StatsGrid({ data }: StatsGridProps) {
  const stats = [
    {
      title: 'Total Supply',
      value: (data.supply / 1000000000).toFixed(1) + 'B',
      icon: Coins,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Holders',
      value: data.holders.toLocaleString(),
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Market Cap',
      value: '$' + (data.marketCap / 1000000).toFixed(1) + 'M',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10'
    },
    {
      title: '24h Volume',
      value: '$' + (data.volume24h / 1000).toFixed(0) + 'K',
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-br ${stat.bgColor} border-gray-200 hover:scale-105 transition-transform duration-200`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
