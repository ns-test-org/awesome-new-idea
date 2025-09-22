'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiStatus, xavaApi } from '@/lib/api';

export default function ApiStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(getApiStatus());
  }, []);

  const testApis = async () => {
    setLoading(true);
    const results: any = {};

    try {
      console.log('Testing price API...');
      const priceStart = Date.now();
      const price = await xavaApi.getCurrentPrice();
      results.price = {
        success: true,
        data: price,
        responseTime: Date.now() - priceStart
      };
    } catch (error) {
      results.price = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    try {
      console.log('Testing stats API...');
      const statsStart = Date.now();
      const stats = await xavaApi.getStats();
      results.stats = {
        success: true,
        data: stats,
        responseTime: Date.now() - statsStart
      };
    } catch (error) {
      results.stats = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    try {
      console.log('Testing transactions API...');
      const txStart = Date.now();
      const transactions = await xavaApi.getNewTransactions(3);
      results.transactions = {
        success: true,
        data: transactions,
        responseTime: Date.now() - txStart
      };
    } catch (error) {
      results.transactions = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    try {
      console.log('Testing price history API...');
      const historyStart = Date.now();
      const history = await xavaApi.getPriceHistory();
      results.history = {
        success: true,
        data: { length: history.length, sample: history.slice(0, 3) },
        responseTime: Date.now() - historyStart
      };
    } catch (error) {
      results.history = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">XAVA API Status</h1>
          <p className="text-purple-200">Real-time API monitoring and testing</p>
        </div>

        {status && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-300">Status: {status.message}</h3>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Available APIs:</h4>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(status.apis).map(([name, description]) => (
                      <li key={name} className="flex justify-between">
                        <span className="capitalize">{name}:</span>
                        <span className="text-purple-200">{description as string}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="space-y-1 text-sm text-purple-200">
                    <li>• {status.rateLimiting}</li>
                    <li>• Caching: {status.caching}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <button
            onClick={testApis}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Testing APIs...' : 'Test All APIs'}
          </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(testResults).map(([apiName, result]: [string, any]) => (
              <Card key={apiName} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="capitalize">{apiName} API</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.success ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {result.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  {result.success ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-300">
                        Response time: {result.responseTime}ms
                      </p>
                      <div className="bg-black/20 p-3 rounded text-xs overflow-auto max-h-40">
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-300">
                      <p className="text-sm">Error: {result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
