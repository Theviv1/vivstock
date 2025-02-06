import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TradeProgress from '../components/TradeProgress';
import TradeModal from '../components/TradeModal';

function Trade() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState(null);
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
      setSelectedTrade(null);
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
          trades.map(trade => (
            <div
              key={trade.id}
              className="bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
              onClick={() => setSelectedTrade(trade)}
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
                onComplete={() => handleTradeComplete(trade.id)}
              />
            </div>
          ))
        )}
      </div>

      <TradeModal 
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        trade={selectedTrade}
        onClosePosition={handleTradeComplete}
      />
    </div>
  );
}

export default Trade;