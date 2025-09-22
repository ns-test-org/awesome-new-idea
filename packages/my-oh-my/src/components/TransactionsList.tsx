'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { xavaApi, XavaTransaction } from '@/lib/api';

export function TransactionsList() {
  const [transactions, setTransactions] = useState<XavaTransaction[]>([]);

  useEffect(() => {
    const fetchTransactions = () => {
      const newTransactions = xavaApi.getRecentTransactions(8);
      setTransactions(newTransactions);
    };

    // Initial fetch
    fetchTransactions();

    // Update every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Recent Transactions
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'buy' ? 'bg-green-400/20' : 'bg-red-400/20'
                  }`}>
                    {tx.type === 'buy' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                      <span className="text-white font-mono text-sm">
                        {formatAmount(tx.amount)} XAVA
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{truncateHash(tx.hash)}</span>
                      <ExternalLink className="h-3 w-3" />
                      <span>{formatTime(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono text-sm">
                    ${tx.price.toFixed(6)}
                  </div>
                  <div className="text-xs text-gray-400">
                    ${(tx.amount * tx.price).toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
