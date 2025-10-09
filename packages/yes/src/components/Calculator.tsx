'use client';

import { useState, useEffect } from 'react';

interface HistoryItem {
  calculation: string;
  result: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      try {
        const newValue = calculate(currentValue, inputValue, operation);
        setDisplay(String(newValue));
        setPreviousValue(newValue);
      } catch (error) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          throw new Error('Division by zero');
        }
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      try {
        const newValue = calculate(previousValue, inputValue, operation);
        const calculation = `${previousValue} ${operation} ${inputValue}`;
        const result = String(newValue);
        
        // Add to history
        setHistory(prev => [...prev, { calculation, result }].slice(-10)); // Keep last 10 calculations
        
        setDisplay(result);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      } catch (error) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    const result = currentValue / 100;
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const handleSquareRoot = () => {
    const currentValue = parseFloat(display);
    if (currentValue >= 0) {
      const result = Math.sqrt(currentValue);
      setDisplay(String(result));
      setWaitingForOperand(true);
      
      // Add to history
      setHistory(prev => [...prev, { 
        calculation: `√${currentValue}`, 
        result: String(result) 
      }].slice(-10));
    } else {
      setDisplay('Error');
      setWaitingForOperand(true);
    }
  };

  const handleMemoryStore = () => {
    setMemory(parseFloat(display));
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clear();
      } else if (key === '%') {
        handlePercentage();
      } else if (key.toLowerCase() === 's') {
        handleSquareRoot();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  return (
    <div className="flex gap-4 items-start">
      <div className="max-w-xs bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        {/* Display */}
        <div className="bg-gray-900 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="text-left">
              {memory !== 0 && (
                <span className="text-blue-400 text-xs bg-blue-900 px-2 py-1 rounded">
                  M: {memory}
                </span>
              )}
            </div>
          </div>
          <div className="text-right text-white text-3xl font-mono overflow-hidden">
            {display}
          </div>
          {operation && previousValue !== null && (
            <div className="text-right text-gray-400 text-sm mt-1">
              {previousValue} {operation}
            </div>
          )}
        </div>

      {/* Memory and Function Buttons */}
      <div className="grid grid-cols-5 gap-1 p-2 bg-gray-700">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded transition-colors text-xs"
          onClick={handleMemoryStore}
        >
          MS
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded transition-colors text-xs"
          onClick={handleMemoryRecall}
        >
          MR
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded transition-colors text-xs"
          onClick={handleMemoryClear}
        >
          MC
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded transition-colors text-xs"
          onClick={handleMemoryAdd}
        >
          M+
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-2 rounded transition-colors text-xs"
          onClick={handleSquareRoot}
        >
          √
        </button>
      </div>

      {/* Main Buttons */}
      <div className="grid grid-cols-4 gap-1 p-4">
        {/* Row 1 */}
        <button
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={clear}
        >
          Clear
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={handlePercentage}
        >
          %
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => performOperation('÷')}
        >
          ÷
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => performOperation('×')}
        >
          ×
        </button>

        {/* Row 2 */}
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('7')}
        >
          7
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('8')}
        >
          8
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('9')}
        >
          9
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => performOperation('-')}
        >
          -
        </button>

        {/* Row 3 */}
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('4')}
        >
          4
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('5')}
        >
          5
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('6')}
        >
          6
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => performOperation('+')}
        >
          +
        </button>

        {/* Row 4 */}
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('1')}
        >
          1
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('2')}
        >
          2
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('3')}
        >
          3
        </button>
        <button
          className="row-span-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={handleEquals}
        >
          =
        </button>

        {/* Row 5 */}
        <button
          className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={() => inputNumber('0')}
        >
          0
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded transition-colors"
          onClick={inputDecimal}
        >
          .
        </button>
      </div>

      {/* History Toggle Button */}
      <div className="mt-4 text-center">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>
    </div>

    {/* History Panel */}
    {showHistory && (
      <div className="w-64 bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold">History</h3>
          <button
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded text-xs transition-colors"
            onClick={clearHistory}
          >
            Clear
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No calculations yet</p>
          ) : (
            <div className="space-y-2">
              {history.slice().reverse().map((item, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded text-sm">
                  <div className="text-gray-300">{item.calculation}</div>
                  <div className="text-white font-bold">= {item.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
}















