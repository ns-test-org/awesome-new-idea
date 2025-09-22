// Mock API service for XAVA token data
// In a real implementation, you would connect to actual crypto APIs like CoinGecko, CoinMarketCap, etc.

export interface TokenData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  supply: number;
  holders: number;
  timestamp: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  hash: string;
}

// Generate realistic mock data
const generatePriceHistory = (days: number = 30): PriceHistoryPoint[] => {
  const data: PriceHistoryPoint[] = [];
  const now = Date.now();
  const basePrice = 0.0045; // Base price for XAVA
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const randomFactor = 0.8 + Math.random() * 0.4; // ±20% variation
    const trendFactor = 1 + (Math.sin(i / 10) * 0.1); // Slight trend
    const price = basePrice * randomFactor * trendFactor;
    const volume = 50000 + Math.random() * 200000;
    
    data.push({
      timestamp,
      price: Number(price.toFixed(6)),
      volume: Math.floor(volume)
    });
  }
  
  return data;
};

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = Date.now();
  
  for (let i = 0; i < 20; i++) {
    const timestamp = now - (Math.random() * 24 * 60 * 60 * 1000);
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const amount = Math.floor(Math.random() * 100000) + 1000;
    const price = 0.004 + Math.random() * 0.002;
    
    transactions.push({
      id: `tx_${i}`,
      type,
      amount,
      price: Number(price.toFixed(6)),
      timestamp,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
    });
  }
  
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

// Mock current token data
let currentTokenData: TokenData = {
  price: 0.004523,
  change24h: 12.34,
  volume24h: 1250000,
  marketCap: 45230000,
  supply: 10000000000,
  holders: 15420,
  timestamp: Date.now()
};

// Simulate real-time price updates
const updatePrice = () => {
  const change = (Math.random() - 0.5) * 0.0001; // Small price movements
  currentTokenData = {
    ...currentTokenData,
    price: Math.max(0.001, currentTokenData.price + change),
    timestamp: Date.now()
  };
};

// Update price every 3 seconds
setInterval(updatePrice, 3000);

export const api = {
  async getTokenData(): Promise<TokenData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...currentTokenData };
  },

  async getPriceHistory(days: number = 30): Promise<PriceHistoryPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generatePriceHistory(days);
  },

  async getRecentTransactions(): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateTransactions();
  },

  // Real-time price stream (mock)
  subscribeToPriceUpdates(callback: (data: TokenData) => void) {
    const interval = setInterval(() => {
      callback({ ...currentTokenData });
    }, 3000);

    return () => clearInterval(interval);
  }
};
