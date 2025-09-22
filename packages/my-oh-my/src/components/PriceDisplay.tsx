'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LiveIndicator } from './LiveIndicator';
import { xavaApi, XavaPrice } from '@/lib/api';

export function PriceDisplay() {
  const [priceData, setPriceData] = useState<XavaPrice | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = () => {
      const newPrice = xavaApi.getCurrentPrice();
      setPrevPrice(priceData?.price || null);
      setPriceData(newPrice);
    };

    // Initial fetch
    fetchPrice();

    // Update every 2 seconds for more responsive feel
    const interval = setInterval(fetchPrice, 2000);

    return () => clearInterval(interval);
  }, [priceData?.price]);

  if (!priceData) return null;

  const isPositive = priceData.changePercent24h >= 0;
  const isPriceUp = prevPrice ? priceData.price > prevPrice : false;
  const isPriceDown = prevPrice ? priceData.price < prevPrice : false;

  const formatPrice = (price: number) => {
    return price.toFixed(9); // Show 9 decimal places for precision
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return `${volume.toFixed(0)}`;
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-white">XAVA Token</CardTitle>
        <LiveIndicator />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <motion.div
            key={priceData.price}
            initial={{ scale: 1 }}
            animate={{ 
              scale: isPriceUp ? [1, 1.05, 1] : isPriceDown ? [1, 0.95, 1] : 1,
              color: isPriceUp ? '#10b981' : isPriceDown ? '#ef4444' : '#ffffff'
            }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-white font-mono"
          >
            ${formatPrice(priceData.price)}
          </motion.div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}{priceData.changePercent24h.toFixed(2)}% (24h)
              </span>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>Vol: {formatVolume(priceData.volume24h)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-gray-400">24h High</div>
              <div className="text-green-400 font-mono">${formatPrice(priceData.high24h)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">24h Low</div>
              <div className="text-red-400 font-mono">${formatPrice(priceData.low24h)}</div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 flex justify-between items-center">
            <span>Last updated: {new Date(priceData.timestamp).toLocaleTimeString()}</span>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

