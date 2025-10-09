import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Simple Calculator
        </h1>
        <p className="text-lg text-gray-300">
          A clean and modern calculator built with Next.js and Tailwind CSS
        </p>
      </div>
      
      <Calculator />
      
      <div className="mt-8 text-center max-w-2xl">
        <p className="text-sm text-gray-400 mb-2">
          Click the buttons or use your keyboard to perform calculations
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Keyboard shortcuts:</strong></p>
          <p>Numbers (0-9), operators (+, -, *, /), Enter/= for equals, Escape/C for clear</p>
          <p>% for percentage, S for square root</p>
          <p><strong>Features:</strong> Memory functions (MS, MR, MC, M+), calculation history</p>
        </div>
      </div>
    </div>
  );
}



