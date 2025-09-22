'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { xavaApi, XavaTransaction } from '@/lib/api';

export function TransactionsList() {
  const [transactions, setTransactions] = useState<XavaTransaction[]>([]);
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(new Set());
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeTransactions = () => {
      // Get initial transactions from the API
      const initialTransactions = xavaApi.getAllTransactions();
      if (initialTransactions.length === 0) {
        // If no transactions exist, generate some initial ones
        const newTxs = xavaApi.getNewTransactions(8);
        setTransactions(newTxs);
      } else {
        setTransactions(initialTransactions.slice(0, 8));
      }
      isInitialized.current = true;
    };

    const fetchNewTransactions = () => {
      if (!isInitialized.current) return;
      
      // Get 1-3 new transactions
      const newCount = Math.floor(Math.random() * 3) + 1;
      const newTransactions = xavaApi.getNewTransactions(newCount);
      
      if (newTransactions.length > 0) {
        // Mark new transactions for animation
        const newIds = new Set(newTransactions.map(tx => tx.id));
        setNewTransactionIds(newIds);
        
        // Add new transactions to the top and keep only the latest 8
        setTransactions(prev => {
          const updated = [...newTransactions, ...prev].slice(0, 8);
          return updated;
        });
        
        // Clear the new transaction markers after animation
        setTimeout(() => {
          setNewTransactionIds(new Set());
        }, 1000);
      }
    };

    // Initial fetch
    initializeTransactions();

    // Update every 3-7 seconds (random interval for more realistic feel)
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 4000; // 3-7 seconds
      setTimeout(() => {
        fetchNewTransactions();
        scheduleNext();
      }, delay);
    };
    
    scheduleNext();

    return () => {
      // Cleanup is handled by the timeout chain
    };
  }, []);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else if (value >= 1) {
      return `${value.toFixed(2)}`;
    } else {
      return `${value.toFixed(4)}`;
    }
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {transactions.map((tx, index) => {
              const isNew = newTransactionIds.has(tx.id);
              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ 
                    opacity: 0, 
                    y: -20, 
                    scale: 0.95,
                    backgroundColor: isNew ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    scale: 0.95,
                    transition: { duration: 0.2 }
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: isNew ? 0 : index * 0.02,
                    backgroundColor: { duration: isNew ? 2 : 0.3 }
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full transition-all duration-300 ${
                      tx.type === 'buy' 
                        ? 'bg-green-400/20 group-hover:bg-green-400/30' 
                        : 'bg-red-400/20 group-hover:bg-red-400/30'
                    }`}>
                      {tx.type === 'buy' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold text-xs px-2 py-1 rounded ${
                          tx.type === 'buy' 
                            ? 'text-green-400 bg-green-400/10' 
                            : 'text-red-400 bg-red-400/10'
                        }`}>
                          {tx.type.toUpperCase()}
                        </span>
                        <span className="text-white font-mono text-sm">
                          {formatAmount(tx.amount)} XAVA
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        <span className="font-mono">{truncateHash(tx.hash)}</span>
                        <span>•</span>
                        <span>{formatTime(tx.timestamp)}</span>
                        <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <span>From:</span>
                        <span className="font-mono">{truncateAddress(tx.from)}</span>
                        <span>→</span>
                        <span className="font-mono">{truncateAddress(tx.to)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-mono text-sm">
                      ${tx.price.toFixed(9)}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">
                      {formatValue(tx.value)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}



