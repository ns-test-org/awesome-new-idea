'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TokenData } from '@/lib/api';

interface PriceDisplayProps {
  data: TokenData;
}

export function PriceDisplay({ data }: PriceDisplayProps) {
  const isPositive = data.change24h >= 0;
  
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            X
          </div>
          XAVA Token
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <motion.div
            key={data.price}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-4xl font-bold text-gray-900">
              ${data.price.toFixed(6)}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </motion.div>
          
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
            </span>
            <span className="text-gray-500 text-sm">24h</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Volume 24h</p>
              <p className="font-semibold">${data.volume24h.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="font-semibold">${(data.marketCap / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
