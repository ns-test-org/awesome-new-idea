'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { xavaApi, XavaChartData } from '@/lib/api';

export function PriceChart() {
  const [chartData, setChartData] = useState<XavaChartData[]>([]);

  useEffect(() => {
    const fetchChartData = () => {
      const data = xavaApi.getPriceHistory();
      setChartData(data);
    };

    // Initial fetch
    fetchChartData();

    // Update every 30 seconds
    const interval = setInterval(fetchChartData, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    // Smart price formatting based on price range
    if (price >= 1) {
      return `${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `${price.toFixed(4)}`;
    } else {
      return `${price.toFixed(6)}`;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-white">Price Chart (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatDate}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={formatPrice}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                labelFormatter={(timestamp) => formatDate(Number(timestamp))}
                formatter={(price: number) => [formatPrice(price), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

