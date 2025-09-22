// Mock API service for XAVA token data
// In a real app, you'd connect to actual crypto APIs like CoinGecko, CoinMarketCap, etc.

export interface XavaPrice {
  price: number;
  change24h: number;
  timestamp: number;
}

export interface XavaStats {
  marketCap: number;
  volume24h: number;
  holders: number;
  totalSupply: number;
}

export interface XavaTransaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  hash: string;
}

export interface XavaChartData {
  timestamp: number;
  price: number;
}

// Mock data generators
const generateRandomPrice = (basePrice: number, volatility: number = 0.02) => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return Math.max(0, basePrice * (1 + change));
};

const generateTransaction = (): XavaTransaction => {
  const type = Math.random() > 0.5 ? 'buy' : 'sell';
  const amount = Math.random() * 10000 + 100;
  const price = generateRandomPrice(0.000123);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    amount,
    price,
    timestamp: Date.now(),
    hash: `0x${Math.random().toString(16).substr(2, 64)}`
  };
};

// Simulated real-time data
let currentPrice = 0.000123;
let priceHistory: XavaChartData[] = [];

// Initialize price history (30 days)
const initializePriceHistory = () => {
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 30; i++) {
    const timestamp = thirtyDaysAgo + (i * 24 * 60 * 60 * 1000);
    const price = generateRandomPrice(0.000123, 0.05);
    priceHistory.push({ timestamp, price });
  }
};

initializePriceHistory();

export const xavaApi = {
  getCurrentPrice: (): XavaPrice => {
    currentPrice = generateRandomPrice(currentPrice, 0.01);
    const change24h = (Math.random() - 0.5) * 20; // -10% to +10%
    
    return {
      price: currentPrice,
      change24h,
      timestamp: Date.now()
    };
  },

  getStats: (): XavaStats => {
    return {
      marketCap: 12500000 + (Math.random() - 0.5) * 1000000,
      volume24h: 850000 + (Math.random() - 0.5) * 200000,
      holders: 15420 + Math.floor(Math.random() * 100),
      totalSupply: 100000000000
    };
  },

  getRecentTransactions: (limit: number = 10): XavaTransaction[] => {
    return Array.from({ length: limit }, generateTransaction)
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  getPriceHistory: (): XavaChartData[] => {
    // Add current price to history
    const now = Date.now();
    const lastEntry = priceHistory[priceHistory.length - 1];
    
    if (now - lastEntry.timestamp > 60000) { // Add new point every minute
      priceHistory.push({ timestamp: now, price: currentPrice });
      
      // Keep only last 30 days
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      priceHistory = priceHistory.filter(entry => entry.timestamp > thirtyDaysAgo);
    }
    
    return priceHistory;
  }
};
