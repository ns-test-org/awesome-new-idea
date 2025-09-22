'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Transaction } from '@/lib/api';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔄 Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  tx.type === 'buy' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {tx.type === 'buy' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold capitalize ${
                      tx.type === 'buy' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type}
                    </span>
                    <span className="text-sm text-gray-500">{tx.hash}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {tx.amount.toLocaleString()} XAVA @ ${tx.price.toFixed(6)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${(tx.amount * tx.price).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(tx.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
