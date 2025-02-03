// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import TradeProgress from '../components/TradeProgress';

// function Trade() {
//   const [trades, setTrades] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTrades();
//     // Set up interval to refresh trades
//     const interval = setInterval(fetchTrades, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchTrades = () => {
//     try {
//       const storedTrades = JSON.parse(localStorage.getItem('trades') || '[]');
//       const activeTrades = storedTrades.filter(trade => trade.status === 'active');
//       setTrades(activeTrades);
//     } catch (error) {
//       console.error('Error fetching trades:', error);
//       toast.error('Failed to load trades');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTradeComplete = (tradeId) => {
//     try {
//       const storedTrades = JSON.parse(localStorage.getItem('trades') || '[]');
//       const updatedTrades = storedTrades.map(trade => {
//         if (trade.id === tradeId) {
//           return {
//             ...trade,
//             status: 'completed',
//             profitPercentage: 0.8,
//             completedAt: new Date().toISOString()
//           };
//         }
//         return trade;
//       });

//       localStorage.setItem('trades', JSON.stringify(updatedTrades));
//       fetchTrades();
//       toast.success('Trade completed successfully');
//     } catch (error) {
//       console.error('Error completing trade:', error);
//       toast.error('Failed to complete trade');
//     }
//   };

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-2xl font-semibold mb-6 text-center">Active Trades</h1>
      
//       <div className="space-y-4">
//         <AnimatePresence>
//           {loading ? (
//             <div className="text-center py-4">Loading trades...</div>
//           ) : trades.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="w-full h-[80vh] flex items-center justify-center font-semibold text-gray-400"
//             >
//               <p>No Active Trades</p>
//             </motion.div>
//           ) : (
//             trades.map(trade => (
//               <motion.div
//                 key={trade.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="bg-[#1A1A1A] rounded-lg p-4"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <h3 className="font-semibold">{trade.name}</h3>
//                     <p className="text-sm text-gray-400">{trade.symbol}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold">${parseFloat(trade.price).toFixed(2)}</p>
//                     <p className={`text-sm ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
//                       {trade.type.toUpperCase()}
//                     </p>
//                   </div>
//                 </div>
                
//                 <TradeProgress 
//                   trade={trade}
//                   onComplete={() => handleTradeComplete(trade.id)}
//                 />
//               </motion.div>
//             ))
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// export default Trade;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TradeProgress from '../components/TradeProgress';

function Trade() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrades();
    // Set up interval to refresh trades
    const interval = setInterval(fetchTrades, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrades = () => {
    try {
      const storedTrades = JSON.parse(localStorage.getItem('trades') || '[]');
      const activeTrades = storedTrades.filter(trade => trade.status === 'active');
      setTrades(activeTrades);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfitPercentage = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const elapsedTime = now - createdDate; // Elapsed time in milliseconds
    const elapsedHours = elapsedTime / (1000 * 60 * 60); // Convert to hours

    if (elapsedHours < 7) {
      // If less than 7 hours, profit cannot exceed 0.05
      return Math.min(0.05, (elapsedHours / 7) * 0.8);
    } else {
      // If 7 hours or more, profit can go up to 0.8
      return Math.min(0.8, ((elapsedHours - 7) / 7) * 0.8 + 0.05);
    }
  };

  const handleTradeComplete = (tradeId) => {
    try {
      const storedTrades = JSON.parse(localStorage.getItem('trades') || '[]');
      const updatedTrades = storedTrades.map(trade => {
        if (trade.id === tradeId) {
          return {
            ...trade,
            status: 'completed',
            profitPercentage: 0.8,
            completedAt: new Date().toISOString()
          };
        }
        return trade;
      });

      localStorage.setItem('trades', JSON.stringify(updatedTrades));
      fetchTrades();
      toast.success('Trade completed successfully');
    } catch (error) {
      console.error('Error completing trade:', error);
      toast.error('Failed to complete trade');
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Active Trades</h1>
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading trades...</div>
        ) : trades.length === 0 ? (
          <div className="w-full h-[80vh] flex items-center justify-center font-semibold text-gray-400">
            <p>No Active Trades</p>
          </div>
        ) : (
          trades.map(trade => {
            const profitPercentage = calculateProfitPercentage(trade.createdAt);

            return (
              <div
                key={trade.id}
                className="bg-[#1A1A1A] rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">{trade.name}</h3>
                    <p className="text-sm text-gray-400">{trade.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <TradeProgress 
                  trade={trade}
                  profitPercentage={profitPercentage}
                  onComplete={() => handleTradeComplete(trade.id)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Trade;