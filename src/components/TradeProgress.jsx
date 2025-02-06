import { useState, useEffect } from 'react';

export default function TradeProgress({ trade, onComplete }) {
  const [displayedProfit, setDisplayedProfit] = useState(0.01);

  useEffect(() => {
    const startTime = new Date(trade.timestamp).getTime();
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedHours = (currentTime - startTime) / (1000 * 60 * 60);

      let newProfit;
      if (elapsedHours < 7) {
        // Before 7 hours, cap at 0.5
        newProfit = Math.min(0.5, (elapsedHours / 7) * 0.8);
      } else {
        // After 7 hours, allow up to 0.8
        newProfit = 0.8;
        onComplete?.();
      }

      // Ensure minimum profit is 0.01
      newProfit = Math.max(0.01, newProfit);
      setDisplayedProfit(newProfit);
    }, 1000);

    return () => clearInterval(interval);
  }, [trade.timestamp, onComplete]);

  const formatProfit = (value) => {
    return (value * 100).toFixed(2);
  };

  const getProfitColor = (value) => {
    if (value < 0.1) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-400">Profit</span>
      <span className={`text-sm font-medium ${getProfitColor(displayedProfit)}`}>
        {displayedProfit}%
      </span>
    </div>
  );
}