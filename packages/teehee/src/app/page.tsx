'use client';

import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
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
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="w-80">
          {/* Display */}
          <div className="bg-black/30 rounded-2xl p-6 mb-4 border border-white/10">
            <div className="text-right">
              <div className="text-4xl font-light text-white font-mono overflow-hidden">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <button
              onClick={clear}
              className="col-span-2 bg-red-500/80 hover:bg-red-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              Clear
            </button>
            <button
              onClick={() => performOperation('÷')}
              className="bg-orange-500/80 hover:bg-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              ÷
            </button>
            <button
              onClick={() => performOperation('×')}
              className="bg-orange-500/80 hover:bg-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              ×
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputNumber('7')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              9
            </button>
            <button
              onClick={() => performOperation('-')}
              className="bg-orange-500/80 hover:bg-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              -
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputNumber('4')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              6
            </button>
            <button
              onClick={() => performOperation('+')}
              className="bg-orange-500/80 hover:bg-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              +
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputNumber('1')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              3
            </button>
            <button
              onClick={handleEquals}
              className="row-span-2 bg-blue-500/80 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              =
            </button>

            {/* Row 5 */}
            <button
              onClick={() => inputNumber('0')}
              className="col-span-2 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              .
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

