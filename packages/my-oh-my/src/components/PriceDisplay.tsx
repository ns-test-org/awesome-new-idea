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

    // Update every 3 seconds
    const interval = setInterval(fetchPrice, 3000);

    return () => clearInterval(interval);
  }, [priceData?.price]);

  if (!priceData) return null;

  const isPositive = priceData.change24h >= 0;
  const isPriceUp = prevPrice ? priceData.price > prevPrice : false;
  const isPriceDown = prevPrice ? priceData.price < prevPrice : false;

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
            className="text-4xl font-bold text-white"
          >
            ${priceData.price.toFixed(6)}
          </motion.div>
          
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
              {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}% (24h)
            </span>
          </div>
          
          <div className="text-xs text-gray-400">
            Last updated: {new Date(priceData.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
