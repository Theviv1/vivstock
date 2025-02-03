// import { useEffect, useRef, useState, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function TradeProgress({ trade, onComplete }) {
//   const [progress, setProgress] = useState(0.0001);
//   const [isAnimating, setIsAnimating] = useState(true);
//   const startTimeRef = useRef(new Date(trade.timestamp).getTime());
//   const animationFrameRef = useRef();
//   const totalDuration = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
//   const initialAnimationDuration = 2000; // 2 seconds for initial animation

//   const calculateProgress = useCallback((currentTime) => {
//     const elapsed = currentTime - startTimeRef.current;
    
//     // Initial quick animation from 0.0001% to 0.05%
//     if (elapsed < initialAnimationDuration) {
//       return 0.0001 + (0.0499 * (elapsed / initialAnimationDuration));
//     }
    
//     // Main progress from 0.05% to 0.8% over 7 hours
//     const mainProgress = (elapsed - initialAnimationDuration) / (totalDuration - initialAnimationDuration);
//     const progress = Math.min(0.05 + (0.75 * mainProgress), 0.8);
    
//     // Cap at 0.06% if less than 7 hours have passed
//     if (elapsed < totalDuration && progress > 0.06) {
//       return 0.06;
//     }
    
//     return progress;
//   }, []);

//   const animate = useCallback(() => {
//     const currentTime = Date.now();
//     const newProgress = calculateProgress(currentTime);
    
//     if (newProgress >= 0.8) {
//       setProgress(0.8);
//       setIsAnimating(false);
//       onComplete?.();
//       return;
//     }

//     setProgress(newProgress);
//     animationFrameRef.current = requestAnimationFrame(animate);
//   }, [calculateProgress, onComplete]);

//   useEffect(() => {
//     animate();
//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, [animate]);

//   const formatProgress = (value) => {
//     return (value * 100).toFixed(2);
//   };

//   const getProgressColor = (value) => {
//     if (value < 0.05) return 'text-red-500';
//     return 'text-green-500';
//   };

//   return (
//     <AnimatePresence>
//       <div className="space-y-2">
//         <div className="flex justify-between items-center mb-2">
//           <div>
//             <span className="text-sm font-medium">{trade.type === 'buy' ? 'Buying' : 'Selling'}</span>
//             <span className="text-sm text-gray-400 ml-2">{trade.symbol}</span>
//           </div>
//           <span className={`text-sm font-medium ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
//             ${parseFloat(trade.price).toFixed(2)}
//           </span>
//         </div>
        
//         <div className="relative w-full bg-gray-800 rounded-full h-2 overflow-hidden">
//           <motion.div
//             className="h-full bg-purple-600"
//             initial={{ width: '0%' }}
//             animate={{ width: `${progress * 100}%` }}
//             transition={{ duration: 0.5, ease: 'easeInOut' }}
//           />
//         </div>
        
//         <div className="flex justify-between items-center">
//           <span className="text-sm text-gray-400">Profit</span>
//           <motion.span
//             key={progress}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`text-sm font-medium ${getProgressColor(progress)}`}
//           >
//             {formatProgress(progress)}%
//           </motion.span>
//         </div>
//       </div>
//     </AnimatePresence>
//   );
// }


import { useState, useEffect } from 'react';

export default function TradeProgress({ trade, profitPercentage, onComplete }) {
  const [displayedProfit, setDisplayedProfit] = useState(0.0001);

  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const duration = 2000; // 2 seconds for the initial animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Animate from 0.0001 to the target profitPercentage
      const newProfit = 0.0001 + (profitPercentage - 0.0001) * progress;
      setDisplayedProfit(newProfit);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // If the animation is complete, check if the trade is completed
        if (profitPercentage >= 0.8) {
          onComplete?.();
        }
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [profitPercentage, onComplete]);

  const formatProfit = (value) => {
    return (value * 100).toFixed(4);
  };

  const getProfitColor = (value) => {
    if (value < 0.05) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-400">Profit</span>
      <span className={`text-sm font-medium ${getProfitColor(displayedProfit)}`}>
        {formatProfit(displayedProfit)}%
      </span>
    </div>
  );
}